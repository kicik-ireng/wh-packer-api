// V3

import { Global, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Global()
@Injectable()
export class MonthlyRekapService {
  private readonly logger = new Logger(MonthlyRekapService.name);

  constructor(private prisma: PrismaService) { }

  // Ambil rekap jumlah Qty Actual & harga per PIC
  async getRekap(
    year?: number,
    month?: number,
    day?: number,
    from?: string,
    to?: string,
  ) {
    let start: Date;
    let end: Date;

    if (from && to) {
      // Range date
      start = new Date(from);
      start.setHours(0, 0, 0, 0);

      end = new Date(to);
      end.setDate(end.getDate() + 1); // supaya inclusive
      end.setHours(0, 0, 0, 0);
    } else if (year && month && day) {
      // Harian
      start = new Date(year, month - 1, day, 0, 0, 0);
      end = new Date(year, month - 1, day + 1, 0, 0, 0);
    } else if (year && month) {
      // Bulanan
      start = new Date(year, month - 1, 1, 0, 0, 0);
      end = new Date(year, month, 1, 0, 0, 0);
    } else {
      throw new Error('Harus isi minimal (year & month) atau (from & to)');
    }

    const reports = await this.prisma.packingReport.findMany({
      where: { tanggalPacking: { gte: start, lt: end } },
      include: {
        pic1: true,
        pic2: true,
        pic3: true,
        entries: {
          include: { Incoming2r: true, Incoming4r: true },
        },
      },
    });

    // Harga per kode
    const hargaMap2R: Record<string, number> = {
      B1: 207,
      B2: 207,
      C: 47,
      D: 8,
      F: 37,
    };
    const hargaMap4R: Record<string, number> = {
      A1: 400,
      A2: 400,
      A3: 400,
      B: 288,
      B1: 290,
      B2: 290,
      B3: 290,
      E: 15,
    };

    type DetailMap = Record<
      string,
      Record<string, { qty: number; harga: number }>
    >;
    interface PicData {
      total: number;
      totalHarga: number;
      details: DetailMap;
    }

    const picTotals: Record<string, PicData> = {};

    for (const r of reports) {
      // 🔹 Bersihkan PIC: valid, unik, tanpa spasi kosong
      const pics = Array.from(
        new Set(
          [r.pic1?.name, r.pic2?.name, r.pic3?.name]
            .filter((p): p is string => !!p && p.trim() !== '')
            .map((p) => p.trim()),
        ),
      );

      for (const e of r.entries) {
        const qty = e.qtyActualPacking ?? 0;
        if (pics.length === 0) continue;

        const type = e.type?.toLowerCase() ?? 'unknown';
        let kode = 'Unknown';

        if (type === '2r') {
          kode = e.Incoming2r?.kpp ?? 'Unknown';
        } else if (type === '4r') {
          kode = e.Incoming4r?.kppNp ?? 'Unknown';
        }

        const hargaEntry =
          type === '2r' ? (hargaMap2R[kode] ?? 0) : (hargaMap4R[kode] ?? 0);

        if (hargaEntry === 0) {
          this.logger.warn(
            `Harga tidak ditemukan untuk kode ${kode} (${type})`,
          );
        }

        const qtyPerPIC = qty / pics.length;
        const hargaPerPIC = qtyPerPIC * hargaEntry;

        for (const pic of pics) {
          if (!picTotals[pic])
            picTotals[pic] = { total: 0, totalHarga: 0, details: {} };

          picTotals[pic].total += qtyPerPIC;
          picTotals[pic].totalHarga += hargaPerPIC;

          if (!picTotals[pic].details[type]) picTotals[pic].details[type] = {};
          const prev = picTotals[pic].details[type][kode] ?? {
            qty: 0,
            harga: 0,
          };

          picTotals[pic].details[type][kode] = {
            qty: parseFloat((prev.qty + qtyPerPIC).toFixed(2)),
            harga: parseFloat((prev.harga + hargaPerPIC).toFixed(2)),
          };
        }
      }
    }

    return Object.entries(picTotals).map(([picName, data]) => ({
      name: picName,
      totalQty: parseFloat(data.total.toFixed(2)),
      totalHarga: parseFloat(data.totalHarga.toFixed(2)),
      details: data.details,
    }));
  }

  private async sendWhatsAppMessage(message: string) {
    try {
      await axios.post('http://10.10.10.10:13100/v1/whatsapp/send-text', {
        phoneNumber: '083891056151',
        target: '120363401514892754@g.us',
        message,
      });
      this.logger.log('Rekap PIC terkirim ke WA.');
    } catch (error: any) {
      this.logger.error('Gagal kirim WA:', error.message);
    }
  }
}
