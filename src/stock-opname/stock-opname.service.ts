import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockOpnameDto } from './dto/create-stock-opname.dto';
import { UpdateStockOpnameDto } from './dto/update-stock-opname.dto';

@Injectable()
export class StockOpnameService {
  private readonly logger = new Logger(StockOpnameService.name);

  constructor(private prisma: PrismaService) {}

  private async prepareOpnameData(dto: CreateStockOpnameDto) {
    const whereClause = dto.part2rId
      ? { part2rId: dto.part2rId }
      : { part4rId: dto.part4rId! };

    const currentStock = await this.prisma.stock.findFirst({ where: whereClause });
    const qtySystem = dto.qtySystem !== undefined ? dto.qtySystem : (currentStock?.totalStock || 0);
    const qtyActual = dto.qtyActual !== undefined ? dto.qtyActual : 0;
    const qtyDiff = qtyActual - qtySystem;

    // Hitung total IN dan OUT dari history transaksi untuk estimasi beginning stock
    let qtyIn = dto.qtyIn !== undefined ? dto.qtyIn : 0;
    let qtyOut = dto.qtyOut !== undefined ? dto.qtyOut : 0;

    if (dto.qtyIn === undefined || dto.qtyOut === undefined) {
      try {
        const inTx = await this.prisma.stockTransaction.aggregate({
          where: { ...whereClause, type: 'IN' },
          _sum: { qtyChange: true },
        });
        const outTx = await this.prisma.stockTransaction.aggregate({
          where: { ...whereClause, type: 'OUT' },
          _sum: { qtyChange: true },
        });
        if (dto.qtyIn === undefined) qtyIn = Math.abs(inTx._sum.qtyChange || 0);
        if (dto.qtyOut === undefined) qtyOut = Math.abs(outTx._sum.qtyChange || 0);
      } catch (err) {
        this.logger.warn(`Could not compute In/Out aggregate for part: ${err.message}`);
      }
    }

    // Saldo Awal = Saldo Sistem - Barang Masuk + Barang Keluar
    let qtyBeginning = dto.qtyBeginning;
    if (qtyBeginning === undefined) {
      const derivedBeginning = qtySystem - qtyIn + qtyOut;
      qtyBeginning = derivedBeginning >= 0 ? derivedBeginning : qtySystem;
    }

    const rack = dto.rack || currentStock?.rack || null;
    const picStockist = dto.picStockist || dto.pic || 'Stockist';

    return {
      part2rId: dto.part2rId || null,
      part4rId: dto.part4rId || null,
      qtyBeginning,
      qtyIn,
      qtyOut,
      qtySystem,
      qtyActual,
      qtyDiff,
      rack,
      picStockist,
      picApproved: dto.picApproved || null,
      pic: dto.pic || picStockist,
      keterangan: dto.keterangan || null,
      status: dto.status || 'PENDING',
    };
  }

  async create(createStockOpnameDto: CreateStockOpnameDto | CreateStockOpnameDto[]) {
    try {
      if (Array.isArray(createStockOpnameDto)) {
        const items = await Promise.all(
          createStockOpnameDto.map((dto) => this.prepareOpnameData(dto))
        );
        return await this.prisma.stockOpname.createMany({ data: items });
      } else {
        const item = await this.prepareOpnameData(createStockOpnameDto);
        return await this.prisma.stockOpname.create({ data: item });
      }
    } catch (error: any) {
      this.logger.error(`Gagal membuat stock opname: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal membuat stock opname: ' + error.message);
    }
  }

  async getSummary() {
    try {
      const all = await this.prisma.stockOpname.findMany({
        include: {
          part2r: true,
          part4r: true,
        },
      });

      const totalAudited = all.length;
      let totalMatching = 0;
      let totalSurplus = 0;
      let totalDeficit = 0;
      let totalSystemQty = 0;
      let totalActualQty = 0;
      let netDiffQty = 0;
      let pendingCount = 0;
      let approvedCount = 0;

      for (const item of all) {
        totalSystemQty += item.qtySystem || 0;
        totalActualQty += item.qtyActual || 0;
        const diff = item.qtyDiff !== undefined ? item.qtyDiff : (item.qtyActual - item.qtySystem);
        netDiffQty += diff;
        if (diff === 0) totalMatching++;
        else if (diff > 0) totalSurplus++;
        else totalDeficit++;

        if (item.status === 'APPROVED') approvedCount++;
        else if (item.status === 'PENDING') pendingCount++;
      }

      const accuracyRate = totalAudited > 0 ? Number(((totalMatching / totalAudited) * 100).toFixed(2)) : 100;

      return {
        totalAudited,
        totalMatching,
        totalSurplus,
        totalDeficit,
        accuracyRate,
        totalSystemQty,
        totalActualQty,
        netDiffQty,
        pendingCount,
        approvedCount,
      };
    } catch (error: any) {
      this.logger.error(`Gagal mengambil summary stock opname: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil summary stock opname: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.stockOpname.findMany({
        include: {
          part2r: true,
          part4r: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(`Gagal mengambil data stock opname: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data stock opname: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const opname = await this.prisma.stockOpname.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
        },
      });
      if (!opname) {
        throw new NotFoundException(`Stock opname ID ${id} tidak ditemukan`);
      }
      return opname;
    } catch (error: any) {
      this.logger.error(`Gagal mengambil data stock opname ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil data stock opname: ' + error.message);
    }
  }

  async update(id: number, updateStockOpnameDto: UpdateStockOpnameDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existing = await prisma.stockOpname.findUnique({ where: { id } });
        if (!existing) {
          throw new NotFoundException(`Stock opname ID ${id} tidak ditemukan`);
        }

        const targetActual =
          updateStockOpnameDto.qtyActual !== undefined
            ? updateStockOpnameDto.qtyActual
            : existing.qtyActual;

        const targetSystem =
          updateStockOpnameDto.qtySystem !== undefined
            ? updateStockOpnameDto.qtySystem
            : existing.qtySystem;

        const computedDiff = targetActual - targetSystem;

        // If status changes to APPROVED, adjust the stock & record transaction
        if (updateStockOpnameDto.status === 'APPROVED' && existing.status !== 'APPROVED') {
          const whereClause = existing.part2rId
            ? { part2rId: existing.part2rId }
            : { part4rId: existing.part4rId! };

          const currentStock = await prisma.stock.findFirst({ where: whereClause });
          const qtyBefore = currentStock?.totalStock || 0;
          const qtyChange = targetActual - qtyBefore;
          const qtyAfter = targetActual;

          if (currentStock) {
            await prisma.stock.update({
              where: { id: currentStock.id },
              data: { totalStock: targetActual },
            });
          } else {
            await prisma.stock.create({
              data: {
                part2rId: existing.part2rId || null,
                part4rId: existing.part4rId || null,
                totalStock: targetActual,
                rack: existing.rack || null,
              },
            });
          }

          // Record Stock Card Transaction (ADJUSTMENT)
          await prisma.stockTransaction.create({
            data: {
              part2rId: existing.part2rId || null,
              part4rId: existing.part4rId || null,
              type: 'ADJUSTMENT',
              qtyBefore,
              qtyChange,
              qtyAfter,
              pic: updateStockOpnameDto.picApproved || updateStockOpnameDto.pic || existing.picStockist || 'Supervisor Stockist',
              reference: `OPNAME-#${existing.id}`,
              description: `Penyesuaian Fisik Stock Opname oleh Stockist: ${updateStockOpnameDto.keterangan || existing.keterangan || 'Approved'}`,
            },
          });
        }

        return await prisma.stockOpname.update({
          where: { id },
          data: {
            ...updateStockOpnameDto,
            qtyDiff: computedDiff,
          },
        });
      });
    } catch (error: any) {
      this.logger.error(`Gagal update data stock opname ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal update data stock opname: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.stockOpname.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Stock opname ID ${id} tidak ditemukan`);
      }
      return await this.prisma.stockOpname.delete({
        where: { id },
      });
    } catch (error: any) {
      this.logger.error(`Gagal menghapus data stock opname ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus data stock opname: ' + error.message);
    }
  }
}


