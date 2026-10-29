import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockTransactionDto } from './dto/create-stock-transaction.dto';
import { UpdateStockTransactionDto } from './dto/update-stock-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockTransactionService {
  private readonly logger = new Logger(StockTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createStockTransactionDto: CreateStockTransactionDto) {
    try {
      return await this.prisma.stockTransaction.create({
        data: createStockTransactionDto as any,
      });
    } catch (error: any) {
      this.logger.error(`Error create stock transaction: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal membuat transaksi stok: ' + error.message);
    }
  }

  async findAll(query?: any) {
    try {
      const where: any = {};
      if (query?.reference) where.reference = query.reference;
      if (query?.type) where.type = query.type;
      if (query?.part2rId) where.part2rId = Number(query.part2rId);
      if (query?.part4rId) where.part4rId = Number(query.part4rId);

      if (query?.startDate || query?.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      return await this.prisma.stockTransaction.findMany({
        where,
        include: {
          part2r: true,
          part4r: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(`Error findAll stock transactions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil daftar transaksi stok: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const transaction = await this.prisma.stockTransaction.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
        },
      });
      if (!transaction) {
        throw new NotFoundException(`Transaksi stok dengan ID ${id} tidak ditemukan`);
      }
      return transaction;
    } catch (error: any) {
      this.logger.error(`Error findOne stock transaction ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil transaksi stok: ' + error.message);
    }
  }

  async getStockCard(type: '2r' | '4r', partId: number, query?: any) {
    try {
      const is4R = type === '4r';

      const [part, stock] = await Promise.all([
        is4R
          ? this.prisma.partDatabase4r.findUnique({ where: { id: partId } })
          : this.prisma.partDatabase2r.findUnique({ where: { id: partId } }),
        this.prisma.stock.findFirst({
          where: is4R ? { part4rId: partId } : { part2rId: partId },
        }),
      ]);

      if (!part) {
        throw new NotFoundException(`Part ${type.toUpperCase()} dengan ID ${partId} tidak ditemukan`);
      }

      const where: any = is4R ? { part4rId: partId } : { part2rId: partId };
      if (query?.startDate || query?.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const transactions = await this.prisma.stockTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      let totalIn = 0;
      let totalOut = 0;
      let totalAdjustment = 0;

      for (const tx of transactions) {
        if (tx.type === 'IN') {
          totalIn += tx.qtyChange > 0 ? tx.qtyChange : Math.abs(tx.qtyChange);
        } else if (tx.type === 'OUT') {
          totalOut += Math.abs(tx.qtyChange);
        } else if (tx.type === 'ADJUSTMENT') {
          totalAdjustment += tx.qtyChange;
        }
      }

      return {
        part,
        stock: {
          currentStock: stock?.totalStock ?? 0,
          rack: stock?.rack ?? '-',
        },
        summary: {
          currentStock: stock?.totalStock ?? 0,
          totalIn,
          totalOut,
          totalAdjustment,
          totalTransactions: transactions.length,
        },
        transactions: transactions.map((t) => ({
          id: t.id,
          date: t.createdAt,
          type: t.type,
          qtyBefore: t.qtyBefore,
          qtyChange: t.qtyChange,
          qtyAfter: t.qtyAfter,
          pic: t.pic || '-',
          reference: t.reference || '-',
          description: t.description || '-',
        })),
      };
    } catch (error: any) {
      this.logger.error(`Error getStockCard for ${type} part ${partId}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil kartu stok: ' + error.message);
    }
  }

  async update(id: number, updateStockTransactionDto: UpdateStockTransactionDto) {
    try {
      const existing = await this.prisma.stockTransaction.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Transaksi stok dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.stockTransaction.update({
        where: { id },
        data: updateStockTransactionDto as any,
      });
    } catch (error: any) {
      this.logger.error(`Error update stock transaction ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal memperbarui transaksi stok: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.stockTransaction.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Transaksi stok dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.stockTransaction.delete({
        where: { id },
      });
    } catch (error: any) {
      this.logger.error(`Error delete stock transaction ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus transaksi stok: ' + error.message);
    }
  }
}
