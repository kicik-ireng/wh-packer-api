import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDandoriScheduleDto } from './dto/create-dandori-schedule.dto';
import { UpdateDandoriScheduleDto } from './dto/update-dandori-schedule.dto';

@Injectable()
export class DandoriScheduleService {
  private readonly logger = new Logger(DandoriScheduleService.name);

  constructor(private readonly prisma: PrismaService) {}

  private parseDateRange(dateStr: string) {
    const target = new Date(dateStr);
    const start = new Date(target);
    start.setHours(0, 0, 0, 0);
    const end = new Date(target);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async create(dto: CreateDandoriScheduleDto) {
    try {
      const scheduleDate = new Date(dto.scheduleDate);
      if (isNaN(scheduleDate.getTime())) {
        throw new BadRequestException('Format tanggal tidak valid. Gunakan YYYY-MM-DD');
      }

      // Pastikan lineNo rapi (misal "1" atau "Line 1" disimpan terstandarisasi sebagai nomor line murni atau format standar)
      const cleanLineNo = dto.lineNo.replace(/[^0-9]/g, '') || dto.lineNo;

      return await this.prisma.dandoriPackingSchedule.create({
        data: {
          scheduleDate,
          lineNo: cleanLineNo,
          shift: dto.shift || 'Shift 1',
          type: dto.type.toUpperCase(),
          pic1Id: dto.pic1Id || null,
          pic2Id: dto.pic2Id || null,
          pic3Id: dto.pic3Id || null,
          packingReqNo: dto.packingReqNo,
          customerPartNo: dto.customerPartNo || null,
          explannerNo: dto.explannerNo || null,
          model: dto.model || null,
          customer: dto.customer || null,
          Incoming2rId: dto.Incoming2rId || null,
          Incoming4rId: dto.Incoming4rId || null,
          part2rId: dto.part2rId || null,
          part4rId: dto.part4rId || null,
          qtyPlan: dto.qtyPlan,
          qtyActual: 0,
          status: 'SCHEDULED',
          notes: dto.notes || null,
        },
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          part2r: true,
          part4r: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error create dandori schedule: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Gagal membuat schedule dandori: ' + error.message);
    }
  }

  async findAll(query?: { date?: string; lineNo?: string; status?: string }) {
    try {
      const where: any = {};

      if (query?.date) {
        const { start, end } = this.parseDateRange(query.date);
        where.scheduleDate = { gte: start, lte: end };
      }

      if (query?.lineNo) {
        where.lineNo = query.lineNo.replace(/[^0-9]/g, '') || query.lineNo;
      }

      if (query?.status) {
        where.status = query.status;
      }

      return await this.prisma.dandoriPackingSchedule.findMany({
        where,
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          Incoming2r: true,
          Incoming4r: true,
          part2r: true,
          part4r: true,
        },
        orderBy: [{ scheduleDate: 'desc' }, { lineNo: 'asc' }],
      });
    } catch (error: any) {
      this.logger.error(`Error findAll dandori schedules: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil daftar schedule dandori: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.prisma.dandoriPackingSchedule.findUnique({
        where: { id },
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          Incoming2r: true,
          Incoming4r: true,
          part2r: true,
          part4r: true,
          packingReports: {
            include: { entries: true },
          },
        },
      });

      if (!item) {
        throw new NotFoundException(`Schedule Dandori dengan ID ${id} tidak ditemukan`);
      }

      return item;
    } catch (error: any) {
      this.logger.error(`Error findOne dandori schedule ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil detail schedule dandori: ' + error.message);
    }
  }

  async findByLineAndDate(lineNo: string, dateStr: string) {
    try {
      const cleanLineNo = lineNo.replace(/[^0-9]/g, '') || lineNo;
      const { start, end } = this.parseDateRange(dateStr);

      const schedules = await this.prisma.dandoriPackingSchedule.findMany({
        where: {
          lineNo: cleanLineNo,
          scheduleDate: { gte: start, lte: end },
        },
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          Incoming2r: true,
          Incoming4r: true,
          part2r: true,
          part4r: true,
        },
      });

      return schedules;
    } catch (error: any) {
      this.logger.error(`Error findByLineAndDate line ${lineNo} date ${dateStr}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengecek schedule line: ' + error.message);
    }
  }

  async getDashboardLines(dateStr?: string) {
    try {
      const targetDate = dateStr || new Date().toISOString().slice(0, 10);
      const { start, end } = this.parseDateRange(targetDate);

      // Ambil seluruh schedule dandori hari ini
      const schedules = await this.prisma.dandoriPackingSchedule.findMany({
        where: {
          scheduleDate: { gte: start, lte: end },
        },
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          Incoming2r: true,
          Incoming4r: true,
          part2r: true,
          part4r: true,
        },
      });

      // Ambil aktual report hari ini untuk validasi progress
      const reports = await this.prisma.packingReport.findMany({
        where: {
          tanggalPacking: { gte: start, lte: end },
        },
        include: {
          entries: true,
        },
      });

      // Konstruksi status 8 line pabrik (Line 1 s/d Line 8)
      const lines = [];
      for (let i = 1; i <= 8; i++) {
        const lineStr = i.toString();
        const lineSchedules = schedules.filter((s) => s.lineNo === lineStr);
        const lineReports = reports.filter((r) => r.lineNo === lineStr);

        let actualFromReports = 0;
        let actual2R = 0;
        let actual4R = 0;

        for (const rep of lineReports) {
          for (const ent of rep.entries) {
            const qty = ent.qtyActualPacking || 0;
            actualFromReports += qty;
            if (ent.type === '2R') actual2R += qty;
            if (ent.type === '4R') actual4R += qty;
          }
        }

        if (lineSchedules.length === 0) {
          lines.push({
            lineNo: i,
            hasSchedule: false,
            status: 'NO_SCHEDULE',
            statusLabel: 'Belum Ada Schedule',
            statusColor: 'gray',
            mps: [],
            tasks: [],
            plan2R: 0,
            plan4R: 0,
            totalPlan: 0,
            actual2R,
            actual4R,
            totalActual: actualFromReports,
            progressPercent: 0,
          });
        } else {
          // Kumpulkan manpower unik di line tersebut
          const mpSet = new Map<number, string>();
          lineSchedules.forEach((s) => {
            if (s.pic1) mpSet.set(s.pic1.id, s.pic1.name);
            if (s.pic2) mpSet.set(s.pic2.id, s.pic2.name);
            if (s.pic3) mpSet.set(s.pic3.id, s.pic3.name);
          });
          const mps = Array.from(mpSet.values());

          let totalPlan = 0;
          let plan2R = 0;
          let plan4R = 0;

          const tasks = lineSchedules.map((s) => {
            totalPlan += s.qtyPlan;
            if (s.type === '2R') plan2R += s.qtyPlan;
            if (s.type === '4R') plan4R += s.qtyPlan;

            return {
              id: s.id,
              packingReqNo: s.packingReqNo,
              type: s.type,
              model: s.model || s.part2r?.model || s.part4r?.model || '-',
              customerPartNo: s.customerPartNo || s.part2r?.oeNo || s.part4r?.oeNo || '-',
              explannerNo: s.explannerNo || s.part2r?.assyNo16 || s.part4r?.assyNo16 || '-',
              customer: s.customer || s.part2r?.customer || s.part4r?.customer || '-',
              qtyPlan: s.qtyPlan,
              qtyActual: s.qtyActual,
              status: s.status,
            };
          });

          // Gunakan actual tertinggi antara catatan schedule dan packing entries
          const totalActual = Math.max(
            actualFromReports,
            lineSchedules.reduce((acc, s) => acc + s.qtyActual, 0),
          );

          const progressPercent = totalPlan > 0 ? Math.min(100, Math.round((totalActual / totalPlan) * 100)) : 0;

          let status = 'SCHEDULED';
          let statusLabel = 'Belum Mulai';
          let statusColor = 'yellow';

          if (totalActual >= totalPlan && totalPlan > 0) {
            status = 'COMPLETED';
            statusLabel = 'Selesai';
            statusColor = 'green';
          } else if (totalActual > 0) {
            status = 'IN_PROGRESS';
            statusLabel = 'Sedang Dikerjakan';
            statusColor = 'cyan';
          }

          lines.push({
            lineNo: i,
            hasSchedule: true,
            status,
            statusLabel,
            statusColor,
            mps,
            tasks,
            plan2R,
            plan4R,
            totalPlan,
            actual2R,
            actual4R,
            totalActual,
            progressPercent,
          });
        }
      }

      return {
        date: targetDate,
        totalLines: 8,
        activeLines: lines.filter((l) => l.hasSchedule).length,
        lines,
      };
    } catch (error: any) {
      this.logger.error(`Error getDashboardLines for date ${dateStr}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data dashboard line: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateDandoriScheduleDto) {
    try {
      const existing = await this.prisma.dandoriPackingSchedule.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Schedule Dandori ID ${id} tidak ditemukan`);
      }

      const data: any = { ...dto };
      if (dto.scheduleDate) {
        data.scheduleDate = new Date(dto.scheduleDate);
      }
      if (dto.lineNo) {
        data.lineNo = dto.lineNo.replace(/[^0-9]/g, '') || dto.lineNo;
      }

      return await this.prisma.dandoriPackingSchedule.update({
        where: { id },
        data,
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error update dandori schedule ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal update schedule dandori: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.dandoriPackingSchedule.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Schedule Dandori ID ${id} tidak ditemukan`);
      }

      return await this.prisma.dandoriPackingSchedule.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error delete dandori schedule ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus schedule dandori: ' + error.message);
    }
  }
}
