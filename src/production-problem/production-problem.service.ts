import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateProductionProblemDto } from './dto/create-production-problem.dto';
import { UpdateProductionProblemDto } from './dto/update-production-problem.dto';

@Injectable()
export class ProductionProblemService {
  private readonly logger = new Logger(ProductionProblemService.name);

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateProductionProblemDto) {
    try {
      return await this.prisma.productionProblemReport.create({
        data: createDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating production problem report:', error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal membuat laporan kendala produksi',
      );
    }
  }

  async findAll(page?: number, limit?: number) {
    try {
      if (!page || !limit) {
        return await this.prisma.productionProblemReport.findMany({
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
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching production problem reports:', error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal mengambil data kendala produksi',
      );
    }
  }

  async findOne(id: number) {
    try {
      const problem = await this.prisma.productionProblemReport.findUnique({
        where: { id },
      });
      if (!problem)
        throw new NotFoundException(`Laporan kendala produksi ID ${id} tidak ditemukan`);
      return problem;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching production problem ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal mengambil detail kendala produksi',
      );
    }
  }

  async update(id: number, updateDto: UpdateProductionProblemDto) {
    try {
      await this.findOne(id);
      return await this.prisma.productionProblemReport.update({
        where: { id },
        data: updateDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating production problem ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal memperbarui kendala produksi',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.productionProblemReport.delete({ where: { id } });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting production problem ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal menghapus kendala produksi',
      );
    }
  }
}
