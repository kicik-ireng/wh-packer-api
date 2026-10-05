import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { ExcelService } from '../utils/excel.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateIncoming2rDto } from './dto/create-incoming2r.dto';
import { UpdateIncoming2rDto } from './dto/update-incoming2r.dto';

@Injectable()
export class Incoming2rService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: ExcelService,
  ) {}

  async getFilteredPackingReqNo() {
    try {
      const data = await this.prisma.incoming2r.findMany({
        where: {
          status: { not: 'APPROVED' },
        },
      });

      return data;
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil PackingReqNo');
    }
  }

  async updateIncomingStatusFromPackingReport() {
    try {
      // Get packing-report
      const packingReportRes = await fetch(
        'http://localhost:3001/packing-report',
      );
      if (!packingReportRes.ok) {
        throw new Error(
          `Gagal mengambil data Packing Report: ${packingReportRes.status}`,
        );
      }

      const packingReportData = await packingReportRes.json();

      // console.log("Data Packing Report:", packingReportData);

      if (
        !packingReportData.entries ||
        !Array.isArray(packingReportData.entries)
      ) {
        throw new Error('Data Packing Report tidak valid');
      }

      for (const report of packingReportData.entries) {
        if (report.Incoming2rId && report.status) {
          // Update status
          await this.prisma.incoming2r.update({
            where: { id: report.Incoming2rId },
            data: { status: report.status },
          });
        }
      }

      return {
        message: 'Status Incoming2r berhasil diperbarui sesuai Packing Report',
      };
    } catch (error) {
      console.error('Error update status:', error.message, error.stack);
      throw new InternalServerErrorException('Gagal memperbarui status');
    }
  }

  async create(file: Express.Multer.File) {
    try {
      const filename = file.originalname.toLowerCase();
      if (!filename.includes('2r')) {
        throw new ConflictException('Nama file harus mengandung "2R"');
      }

      const data = await this.excelService.readExcel(file);

      const parseIntSafe = (val: any): number => {
        const num = parseInt(val);
        return isNaN(num) ? 0 : num;
      };

      const parseDateSafe = (val: any): Date | null => {
        if (val === null || val === undefined) return null;

        let date: Date | null = null;

        if (val instanceof Date) {
          date = isNaN(val.getTime()) ? null : val;
        } else if (typeof val === 'number') {
          const excelEpoch = new Date(Date.UTC(1899, 11, 30));
          date = new Date(excelEpoch.getTime() + val * 86400000);
          if (isNaN(date.getTime())) return null;
        } else if (typeof val === 'string') {
          const trimmedVal = val.trim();
          const regex = /^(\d{1,2})-([a-zA-Z]{3})-(\d{2,4})$/;
          const match = trimmedVal.match(regex);
          if (match) {
            const day = parseInt(match[1], 10);
            const monStr = match[2].toLowerCase();
            let year = parseInt(match[3], 10);
            if (year < 100) year += 2000;

            const months: Record<string, number> = {
              jan: 0,
              feb: 1,
              mar: 2,
              apr: 3,
              may: 4,
              jun: 5,
              jul: 6,
              aug: 7,
              sep: 8,
              oct: 9,
              nov: 10,
              dec: 11,
            };
            const month = months[monStr];
            if (month === undefined) return null;

            date = new Date(year, month, day);
            if (isNaN(date.getTime())) return null;
          } else {
            const d = new Date(trimmedVal);
            date = isNaN(d.getTime()) ? null : d;
          }
        } else {
          return null;
        }

        if (!date) return null;

        // Add 7 hours
        date = new Date(date.getTime() + 7 * 60 * 60 * 1000);

        return date;
      };

      // Helper Date
      const toLocalDateString = (date: Date): string => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      // dd/mm/yyyy
      const toDDMMYYYY = (date: Date): string => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
      };

      // Get Date H-1
      // const yesterday = new Date();
      // yesterday.setDate(yesterday.getDate() - 1);
      // const yesterdayStr = toLocalDateString(yesterday);

      // Adjust "yesterday" logic: if today is Monday, use Friday (H-3); else, use H-1
      const today = new Date();
      const day = today.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

      // Ambil tanggal hari ini (H), kemarin (H-1), dan kalau hari Senin, tambahkan H-3
      const datesToInclude = new Set<string>();

      // Format function ke YYYY-MM-DD lokal

      //return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      //.toISOString()
      //.split('T')[0]

      // Daftar hari libur
      const holidays = new Set<string>([
        '2025-06-27', // Contoh: Jumat libur
      ]);
      // H
      datesToInclude.add(toLocalDateString(today));

      // H-1
      const hMinus1 = new Date(today);
      hMinus1.setDate(today.getDate() - 1);
      datesToInclude.add(toLocalDateString(hMinus1));

      // H-3 hanya kalau hari Senin

      //   const hMinus3 = new Date(today)
      //   hMinus3.setDate(today.getDate() - 3)
      //   datesToInclude.add(toLocalDateString(hMinus3))

      // Kalau hari ini Senin (day === 1)
      if (day === 1) {
        const hMinus3 = new Date(today);
        hMinus3.setDate(today.getDate() - 3);
        const hMinus3Str = toLocalDateString(hMinus3);

        if (holidays.has(hMinus3Str)) {
          // Kalau Jumat libur, ambil Kamis (H-4)
          const hMinus4 = new Date(today);
          hMinus4.setDate(today.getDate() - 4);
          datesToInclude.add(toLocalDateString(hMinus4));
        } else {
          // Kalau Jumat tidak libur, ambil Jumat (H-3)
          datesToInclude.add(hMinus3Str);
        }
      }

      // Gunakan untuk filter data
      //const filteredEntries = allEntries.filter(entry =>
      //datesToInclude.has(entry.date)
      //)

      const possibleDateKeys = [5, '__EMPTY_3', 'Date'];

      // Map Data
      const allData = data
        .map((row: any) => {
          let rawDate: any = null;
          for (const key of possibleDateKeys) {
            if (
              row[key] !== undefined &&
              row[key] !== null &&
              row[key] !== ''
            ) {
              rawDate = row[key];
              break;
            }
          }

          const parsedDate = parseDateSafe(rawDate);
          if (!parsedDate) return null;

          return {
            prId: String(row[2] || row['__EMPTY'] || ''),
            date: parsedDate,
            cust: String(row[6] || row['__EMPTY_4'] || ''),
            segment: String(row[7] || row['__EMPTY_5'] || ''),
            assyNo16: String(row[8] || row['__EMPTY_6'] || ''),
            assyNo10: String(row[9] || row['__EMPTY_7'] || ''),
            oeNo: String(row[10] || row['__EMPTY_8'] || ''),
            model: String(row[11] || row['__EMPTY_9'] || ''),
            EMIpartname: String(row[12] || row['__EMPTY_10'] || ''),
            kpp: String(row[13] || row['__EMPTY_11'] || ''),
            qtyPlan: parseIntSafe(row[14] || row['__EMPTY_12']),
            _parsedDate: parsedDate,
          };
        })
        .filter((row) => row !== null);

      // Data Filter Where H-1

      // if (!row._parsedDate) return false;
      // const rowDateStr = toLocalDateString(row._parsedDate);
      //  return rowDateStr === yesterdayStr;
      //  });

      //    throw new ConflictException('Data H-1 Tidak Ada !');

      // Gunakan H, H-1, dan (jika Senin) H-3
      const filteredData = allData.filter((row) => {
        if (!row._parsedDate) return false;
        const rowDateStr = toLocalDateString(row._parsedDate);
        return datesToInclude.has(rowDateStr);
      });

      // dd/mm/yyyy
      const cleanedData = filteredData.map(
        ({ _parsedDate, date, ...rest }) => ({
          ...rest,
          date: toDDMMYYYY(_parsedDate),
        }),
      );

      // Save to DB
      await this.prisma.incoming2r.createMany({
        data: cleanedData,
        skipDuplicates: true,
      });

      return { message: 'Data tanggal hari ini berhasil disimpan.' };
    } catch (error) {
      Logger.error('Error uploading Excel to Incoming4r:', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Duplicate PR ID detected.');
        }
      }

      throw new InternalServerErrorException('Gagal menyimpan data Incoming2r');
    }
  }

  async findAll(page?: number, limit?: number) {
    if (!page || !limit) {
      const inc = await this.prisma.incoming2r.findMany({
        take: 500,
        orderBy: {
          status: 'asc',
        },
        include: {
          packingEntries: true,
        },
      });
      return inc.map((i) => ({
        ...i,
        done: i.packingEntries.reduce(
          (sum, entry) => sum + entry.qtyActualPacking,
          0,
        ),
      }));
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.incoming2r.findMany({
        skip,
        take: limit,
        orderBy: {
          status: 'asc',
        },
        include: {
          packingEntries: true,
        },
      }),
      this.prisma.incoming2r.count(),
    ]);

    const mappedData = data.map((i) => ({
      ...i,
      done: i.packingEntries.reduce(
        (sum, entry) => sum + entry.qtyActualPacking,
        0,
      ),
    }));

    return {
      data: mappedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.incoming2r.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateIncoming2rDto) {
    return this.prisma.incoming2r.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.incoming2r.delete({ where: { id } });
  }

  async bulkCreate(data: CreateIncoming2rDto[]) {
    try {
      return await this.prisma.incoming2r.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      Logger.error('Error in bulkCreate Incoming2r:', error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Duplicate PR ID detected in bulk create.');
      }
      throw new InternalServerErrorException(
        'Failed to bulk create Incoming2r data.',
      );
    }
  }
  async manualCreate(dto: CreateIncoming2rDto) {
    try {
      return await this.prisma.incoming2r.create({ data: dto });
    } catch (error) {
      Logger.error('Manual create error:', error);
      throw new InternalServerErrorException('Gagal buat data incoming manual');
    }
  }
}
