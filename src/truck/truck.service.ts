import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@Injectable()
export class TruckService {
  private readonly logger = new Logger(TruckService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTruckDto) {
    try {
      return await this.prisma.truck.create({ data: dto });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating truck:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal menambahkan truk');
    }
  }

  async findAll() {
    try {
      return await this.prisma.truck.findMany({
        orderBy: { noPol: 'asc' },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching truck list:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data truk');
    }
  }

  async findOne(id: number) {
    try {
      const truck = await this.prisma.truck.findUnique({
        where: { id },
        include: { scheduleTruck: true },
      });
      if (!truck) throw new NotFoundException(`Truk dengan ID ${id} tidak ditemukan`);
      return truck;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching truck ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil detail truk');
    }
  }

  async update(id: number, dto: UpdateTruckDto) {
    try {
      await this.findOne(id);
      return await this.prisma.truck.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating truck ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal memperbarui data truk');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.truck.delete({ where: { id } });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting truck ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal menghapus truk');
    }
  }
}
