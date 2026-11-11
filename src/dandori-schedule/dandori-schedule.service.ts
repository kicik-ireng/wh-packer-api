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

  async getAvailableIncoming() {
    try {
      const [in2r, in4r, schedules] = await Promise.all([
        this.prisma.incoming2r.findMany({
          where: { status: { not: 'APPROVED' } },
          orderBy: { createdAt: 'desc' },
          take: 300,
        }),
        this.prisma.incoming4r.findMany({
          where: { status: { not: 'APPROVED' } },
          orderBy: { createdAt: 'desc' },
          take: 300,
        }),
        this.prisma.dandoriPackingSchedule.findMany({
          select: {
            packingReqNo: true,
            type: true,
            qtyPlan: true,
            lineNo: true,
          },
        }),
      ]);

      const mapAllocations = (prId: string, type: string) => {
        const matched = schedules.filter((s) => s.packingReqNo === prId && s.type === type);
        const totalAllocated = matched.reduce((sum, s) => sum + (s.qtyPlan || 0), 0);
        const lines = Array.from(new Set(matched.map((s) => s.lineNo)));
        return { totalAllocated, lines };
      };

      const items2R = in2r.map((item) => {
        const effectiveQty = item.qtyDiterimaFisik ?? item.qtyPlan;
        const { totalAllocated, lines } = mapAllocations(item.prId, '2R');
        const remainingQty = Math.max(0, effectiveQty - totalAllocated);
        return {
          id: item.id,
          prId: item.prId,
          type: '2R',
          customer: item.cust,
          segment: item.segment,
          assyNo16: item.assyNo16,
          assyNo10: item.assyNo10,
          oeNo: item.oeNo,
          model: item.model,
          partName: item.EMIpartname,
          qtySuratJalan: item.qtyPlan,
          qtyDiterimaFisik: item.qtyDiterimaFisik,
          effectiveQty,
          hasDiscrepancy: item.hasDiscrepancy,
          totalAllocated,
          remainingQty,
          allocatedLines: lines,
          status: item.status,
        };
      });

      const items4R = in4r.map((item) => {
        const effectiveQty = item.qtyDiterimaFisik ?? item.qtyPlan;
        const { totalAllocated, lines } = mapAllocations(item.prId, '4R');
        const remainingQty = Math.max(0, effectiveQty - totalAllocated);
        return {
          id: item.id,
          prId: item.prId,
          type: '4R',
          customer: item.cust,
          segment: item.seg,
          assyNo16: item.assyNo16,
          assyNo10: item.assyNo10,
          oeNo: item.oeNo,
          model: item.model,
          partName: item.model,
          qtySuratJalan: item.qtyPlan,
          qtyDiterimaFisik: item.qtyDiterimaFisik,
          effectiveQty,
          hasDiscrepancy: item.hasDiscrepancy,
          totalAllocated,
          remainingQty,
          allocatedLines: lines,
          status: item.status,
        };
      });

      return {
        items2R,
        items4R,
        allItems: [...items2R, ...items4R].sort((a, b) => b.remainingQty - a.remainingQty),
      };
    } catch (error: any) {
      this.logger.error(`Error getAvailableIncoming: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data incoming siap plan: ' + error.message);
    }
  }

  async planSplit(dto: {
    prId: string;
    type: string;
    scheduleDate: string;
    allocations: {
      lineNo: string;
      shift?: string;
      qtyPlan: number;
      pic1Id?: number;
      pic2Id?: number;
      pic3Id?: number;
      notes?: string;
    }[];
  }) {
    try {
      const type = dto.type.toUpperCase();
      const scheduleDate = new Date(dto.scheduleDate);

      if (isNaN(scheduleDate.getTime())) {
        throw new BadRequestException('Format tanggal tidak valid. Gunakan YYYY-MM-DD');
      }

      if (!dto.allocations || dto.allocations.length === 0) {
        throw new BadRequestException('Harus menentukan minimal 1 alokasi line.');
      }

      let incoming: any = null;
      let part2rId: number | null = null;
      let part4rId: number | null = null;
      let customerPartNo: string | null = null;
      let explannerNo: string | null = null;
      let model: string | null = null;
      let customer: string | null = null;

      if (type === '2R') {
        incoming = await this.prisma.incoming2r.findUnique({ where: { prId: dto.prId } });
        if (!incoming) throw new NotFoundException(`Incoming 2R dengan PR ${dto.prId} tidak ditemukan`);
        customerPartNo = incoming.oeNo;
        explannerNo = incoming.assyNo16;
        model = incoming.model;
        customer = incoming.cust;

        const p = await this.prisma.partDatabase2r.findFirst({
          where: { assyNo16: incoming.assyNo16, oeNo: incoming.oeNo },
        });
        if (p) part2rId = p.id;
      } else {
        incoming = await this.prisma.incoming4r.findUnique({ where: { prId: dto.prId } });
        if (!incoming) throw new NotFoundException(`Incoming 4R dengan PR ${dto.prId} tidak ditemukan`);
        customerPartNo = incoming.oeNo;
        explannerNo = incoming.assyNo16;
        model = incoming.model;
        customer = incoming.cust;

        const p = await this.prisma.partDatabase4r.findFirst({
          where: { assyNo16: incoming.assyNo16, oeNo: incoming.oeNo },
        });
        if (p) part4rId = p.id;
      }

      const effectiveQty = incoming.qtyDiterimaFisik ?? incoming.qtyPlan;

      // Cek alokasi existing untuk PR ini
      const existingSchedules = await this.prisma.dandoriPackingSchedule.findMany({
        where: { packingReqNo: dto.prId, type },
      });
      const alreadyAllocated = existingSchedules.reduce((sum, s) => sum + s.qtyPlan, 0);
      const newAllocationSum = dto.allocations.reduce((sum, a) => sum + Number(a.qtyPlan || 0), 0);

      if (alreadyAllocated + newAllocationSum > effectiveQty) {
        throw new BadRequestException(
          `POKAYOKE: Total alokasi (${alreadyAllocated + newAllocationSum} pcs) melebihi kuantitas fisik PR yang tersedia (${effectiveQty} pcs). Sisa yang bisa dialokasikan: ${Math.max(0, effectiveQty - alreadyAllocated)} pcs.`
        );
      }

      // Buat schedule per line
      const createdList = [];
      for (const alloc of dto.allocations) {
        const cleanLine = alloc.lineNo.replace(/[^0-9]/g, '') || alloc.lineNo;
        const schedule = await this.prisma.dandoriPackingSchedule.create({
          data: {
            scheduleDate,
            lineNo: cleanLine,
            shift: alloc.shift || 'Shift 1',
            type,
            packingReqNo: dto.prId,
            customerPartNo,
            explannerNo,
            model,
            customer,
            qtyPlan: Number(alloc.qtyPlan),
            qtyActual: 0,
            status: 'SCHEDULED',
            pic1Id: alloc.pic1Id || null,
            pic2Id: alloc.pic2Id || null,
            pic3Id: alloc.pic3Id || null,
            Incoming2rId: type === '2R' ? incoming.id : null,
            Incoming4rId: type === '4R' ? incoming.id : null,
            part2rId,
            part4rId,
            notes: alloc.notes || null,
          },
          include: {
            pic1: true,
            pic2: true,
            pic3: true,
          },
        });
        createdList.push(schedule);
      }

      return {
        message: `Berhasil mengalokasikan PR ${dto.prId} ke ${createdList.length} line produksi`,
        schedules: createdList,
      };
    } catch (error: any) {
      this.logger.error(`Error planSplit for PR ${dto.prId}: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal memproses pembagian rencana produksi: ' + error.message);
    }
  }

  async getLineTasksForOperator(lineNo: string, dateStr: string, shift?: string) {
    try {
      const cleanLineNo = lineNo.replace(/[^0-9]/g, '') || lineNo;
      const { start, end } = this.parseDateRange(dateStr);

      const where: any = {
        lineNo: cleanLineNo,
        scheduleDate: { gte: start, lte: end },
      };
      if (shift) where.shift = shift;

      const schedules = await this.prisma.dandoriPackingSchedule.findMany({
        where,
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          Incoming2r: true,
          Incoming4r: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (schedules.length === 0) {
        return {
          hasSchedule: false,
          message: `Line ${lineNo} belum memiliki jadwal kerja dari Production Planner untuk tanggal ${dateStr}.`,
          tasks: [],
          assignedMPs: [],
        };
      }

      // Ambil packing entries yang sudah disubmit di line ini hari ini
      const entries = await this.prisma.packingEntry.findMany({
        where: {
          packingReport: {
            lineNo: cleanLineNo,
            tanggalPacking: { gte: start, lte: end },
          },
        },
      });

      const tasks = schedules.map((s) => {
        const actualForPr = entries
          .filter((e) => e.packingReqNo === s.packingReqNo && e.type === s.type)
          .reduce((sum, e) => sum + (e.qtyActualPacking || 0), 0);

        const totalActual = Math.max(s.qtyActual, actualForPr);
        const balance = Math.max(0, s.qtyPlan - totalActual);
        const isCompleted = totalActual >= s.qtyPlan;

        return {
          id: s.id,
          scheduleDate: s.scheduleDate,
          lineNo: s.lineNo,
          shift: s.shift,
          type: s.type,
          packingReqNo: s.packingReqNo,
          customerPartNo: s.customerPartNo || s.Incoming2r?.oeNo || s.Incoming4r?.oeNo || '—',
          explannerNo: s.explannerNo || s.Incoming2r?.assyNo16 || s.Incoming4r?.assyNo16 || '—',
          model: s.model || s.Incoming2r?.model || s.Incoming4r?.model || '—',
          customer: s.customer || s.Incoming2r?.cust || s.Incoming4r?.cust || '—',
          qtyPlan: s.qtyPlan,
          qtyActual: totalActual,
          balance,
          isCompleted,
          status: isCompleted ? 'COMPLETED' : totalActual > 0 ? 'IN_PROGRESS' : 'SCHEDULED',
          pic1: s.pic1 ? { id: s.pic1.id, name: s.pic1.name, nik: s.pic1.nik } : null,
          pic2: s.pic2 ? { id: s.pic2.id, name: s.pic2.name, nik: s.pic2.nik } : null,
          pic3: s.pic3 ? { id: s.pic3.id, name: s.pic3.name, nik: s.pic3.nik } : null,
          notes: s.notes,
        };
      });

      const assignedMPsMap = new Map<number, { id: number; name: string }>();
      schedules.forEach((s) => {
        if (s.pic1) assignedMPsMap.set(s.pic1.id, { id: s.pic1.id, name: s.pic1.name });
        if (s.pic2) assignedMPsMap.set(s.pic2.id, { id: s.pic2.id, name: s.pic2.name });
        if (s.pic3) assignedMPsMap.set(s.pic3.id, { id: s.pic3.id, name: s.pic3.name });
      });

      return {
        hasSchedule: true,
        lineNo: cleanLineNo,
        date: dateStr,
        tasks,
        assignedMPs: Array.from(assignedMPsMap.values()),
      };
    } catch (error: any) {
      this.logger.error(`Error getLineTasksForOperator line ${lineNo} date ${dateStr}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil daftar tugas line: ' + error.message);
    }
  }
}
