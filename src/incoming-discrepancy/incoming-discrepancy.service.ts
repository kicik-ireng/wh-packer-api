import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomingDiscrepancyDto } from './dto/create-incoming-discrepancy.dto';
import { UpdateIncomingDiscrepancyDto } from './dto/update-incoming-discrepancy.dto';

@Injectable()
export class IncomingDiscrepancyService {
  private readonly logger = new Logger(IncomingDiscrepancyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIncomingDiscrepancyDto) {
    try {
      const qtySuratJalan = Number(dto.qtySuratJalan);
      const qtyDiterimaFisik = Number(dto.qtyDiterimaFisik);

      if (isNaN(qtySuratJalan) || isNaN(qtyDiterimaFisik)) {
        throw new BadRequestException('Kuantitas surat jalan dan kuantitas fisik harus berupa angka.');
      }

      const qtySelisih = qtySuratJalan - qtyDiterimaFisik;
      const type = dto.type.toUpperCase();
      const date = dto.date ? new Date(dto.date) : new Date();

      return await this.prisma.$transaction(async (tx) => {
        // 1. Catat ke tabel IncomingDiscrepancy
        const discrepancy = await tx.incomingDiscrepancy.create({
          data: {
            date,
            prId: dto.prId,
            type,
            supplierName: dto.supplierName || null,
            suratJalanNo: dto.suratJalanNo || null,
            partNo: dto.partNo || null,
            partName: dto.partName || null,
            qtySuratJalan,
            qtyDiterimaFisik,
            qtySelisih,
            discrepancyType: dto.discrepancyType || (qtySelisih > 0 ? 'BARANG_KURANG' : 'LEBIH_BARANG'),
            picInspector: dto.picInspector || 'Inspector Dandori',
            notes: dto.notes || null,
            status: 'RECORDED',
            Incoming2rId: dto.Incoming2rId || null,
            Incoming4rId: dto.Incoming4rId || null,
          },
        });

        // 2. Update record Incoming terkait agar memegang angka fisik yang benar
        if (type === '2R') {
          const incoming = await tx.incoming2r.findFirst({
            where: dto.Incoming2rId ? { id: dto.Incoming2rId } : { prId: dto.prId },
          });
          if (incoming) {
            await tx.incoming2r.update({
              where: { id: incoming.id },
              data: {
                qtyDiterimaFisik,
                hasDiscrepancy: true,
              },
            });
          }
        } else if (type === '4R') {
          const incoming = await tx.incoming4r.findFirst({
            where: dto.Incoming4rId ? { id: dto.Incoming4rId } : { prId: dto.prId },
          });
          if (incoming) {
            await tx.incoming4r.update({
              where: { id: incoming.id },
              data: {
                qtyDiterimaFisik,
                hasDiscrepancy: true,
              },
            });
          }
        }

        return discrepancy;
      });
    } catch (error: any) {
      this.logger.error(`Error create incoming discrepancy: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Gagal mencatat ketidaksesuaian kedatangan supplier: ' + error.message,
      );
    }
  }

  async findAll(query?: { prId?: string; type?: string; status?: string; startDate?: string; endDate?: string }) {
    try {
      const where: any = {};
      if (query?.prId) where.prId = { contains: query.prId };
      if (query?.type) where.type = query.type.toUpperCase();
      if (query?.status) where.status = query.status;

      if (query?.startDate || query?.endDate) {
        where.date = {};
        if (query.startDate) where.date.gte = new Date(query.startDate);
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.date.lte = end;
        }
      }

      return await this.prisma.incomingDiscrepancy.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
          Incoming2r: true,
          Incoming4r: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error findAll incoming discrepancies: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Gagal mengambil data ketidaksesuaian kedatangan: ' + error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const discrepancy = await this.prisma.incomingDiscrepancy.findUnique({
        where: { id },
        include: {
          Incoming2r: true,
          Incoming4r: true,
        },
      });

      if (!discrepancy) {
        throw new NotFoundException(`Ketidaksesuaian ID ${id} tidak ditemukan`);
      }

      return discrepancy;
    } catch (error: any) {
      this.logger.error(`Error findOne incoming discrepancy ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Gagal mengambil detail ketidaksesuaian: ' + error.message,
      );
    }
  }

  async update(id: number, dto: UpdateIncomingDiscrepancyDto) {
    try {
      await this.findOne(id);
      return await this.prisma.incomingDiscrepancy.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      this.logger.error(`Error update incoming discrepancy ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Gagal memperbarui status ketidaksesuaian: ' + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.incomingDiscrepancy.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Error remove incoming discrepancy ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Gagal menghapus ketidaksesuaian: ' + error.message,
      );
    }
  }
}

