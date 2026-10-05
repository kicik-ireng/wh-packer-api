import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateProductionProblemDto } from './dto/create-production-problem.dto';
import { UpdateProductionProblemDto } from './dto/update-production-problem.dto';

@Injectable()
export class ProductionProblemService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateProductionProblemDto) {
    return this.prisma.productionProblemReport.create({
      data: createDto,
    });
  }

  async findAll(page?: number, limit?: number) {
    // Jika tidak ada parameter pagination, batasi maksimal 500 data terbaru
    // untuk mencegah memori penuh (Out of Memory)
    if (!page || !limit) {
      return this.prisma.productionProblemReport.findMany({
        take: 500,
        orderBy: { createdAt: 'desc' },
      });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.productionProblemReport.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productionProblemReport.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const problem = await this.prisma.productionProblemReport.findUnique({
      where: { id },
    });
    if (!problem)
      throw new NotFoundException('ProductionProblemReport not found');
    return problem;
  }

  async update(id: number, updateDto: UpdateProductionProblemDto) {
    return this.prisma.productionProblemReport.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    return this.prisma.productionProblemReport.delete({ where: { id } });
  }
}
