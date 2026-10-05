import { Global, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Global()
@Injectable()
export class PicRekapService {
  private readonly logger = new Logger(PicRekapService.name);

  constructor(private prisma: PrismaService) {}

  // Ambil rekap jumlah Qty Actual & harga per PIC, per type, per kode
  async getDailyRekap() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const reports = await this.prisma.packingReport.findMany({
      where: { tanggalPacking: { gte: today, lt: tomorrow } },
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
      const pics = [r.pic1?.name, r.pic2?.name, r.pic3?.name].filter(
        (p): p is string => !!p,
      );

      for (const e of r.entries) {
        const qty = e.qtyActualPacking ?? 0;
        if (pics.length === 0) continue;

        const type = e.type ?? 'Unknown';
        const kode =
          e.Incoming2r?.kpp ??
          e.Incoming4r?.kpp ??
          e.Incoming4r?.kppNp ??
          'Unknown';

        const hargaEntry =
          type.toLowerCase() === '2r'
            ? (hargaMap2R[kode] ?? 0)
            : (hargaMap4R[kode] ?? 0);

        const qtyPerPIC = Math.round(qty / pics.length);
        const hargaPerPIC = Math.round(qtyPerPIC * hargaEntry);

        for (const pic of pics) {
          if (!picTotals[pic])
            picTotals[pic] = { total: 0, totalHarga: 0, details: {} };

          picTotals[pic].total += qtyPerPIC;
          picTotals[pic].totalHarga += hargaPerPIC;

          if (!picTotals[pic].details[type]) picTotals[pic].details[type] = {};
          picTotals[pic].details[type][kode] = {
            qty: (picTotals[pic].details[type][kode]?.qty ?? 0) + qtyPerPIC,
            harga:
              (picTotals[pic].details[type][kode]?.harga ?? 0) + hargaPerPIC,
          };
        }
      }
    }

    return Object.entries(picTotals).map(([picName, data]) => ({
      name: picName,
      totalQty: data.total,
      totalHarga: data.totalHarga,
      details: data.details,
    }));
  }
}
