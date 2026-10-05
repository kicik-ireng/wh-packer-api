import { Injectable } from '@nestjs/common';
import { CreateStockTransactionDto } from './dto/create-stock-transaction.dto';
import { UpdateStockTransactionDto } from './dto/update-stock-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStockTransactionDto: CreateStockTransactionDto) {
    return this.prisma.stockTransaction.create({
      data: createStockTransactionDto as any,
    });
  }

  findAll(query?: any) {
    const where: any = {};
    if (query?.reference) where.reference = query.reference;
    if (query?.type) where.type = query.type;
    if (query?.part2rId) where.part2rId = Number(query.part2rId);
    if (query?.part4rId) where.part4rId = Number(query.part4rId);

    return this.prisma.stockTransaction.findMany({
      where,
      include: {
        part2r: true,
        part4r: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.stockTransaction.findUnique({
      where: { id },
      include: {
        part2r: true,
        part4r: true,
      },
    });
  }

  update(id: number, updateStockTransactionDto: UpdateStockTransactionDto) {
    return this.prisma.stockTransaction.update({
      where: { id },
      data: updateStockTransactionDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.stockTransaction.delete({
      where: { id },
    });
  }
}
