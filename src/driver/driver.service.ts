import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateDriverDto) {
    try {
      return await this.prisma.driver.create({ data });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating driver:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal menambahkan driver');
    }
  }

  async findAll() {
    try {
      return await this.prisma.driver.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching driver list:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data driver');
    }
  }

  async findOne(id: number) {
    try {
      const driver = await this.prisma.driver.findUnique({ where: { id } });
      if (!driver) throw new NotFoundException(`Driver dengan ID ${id} tidak ditemukan`);
      return driver;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching driver ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil detail driver');
    }
  }

  async update(id: number, data: UpdateDriverDto) {
    try {
      await this.findOne(id);
      return await this.prisma.driver.update({ where: { id }, data });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating driver ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal memperbarui data driver');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.driver.delete({ where: { id } });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting driver ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal menghapus driver');
    }
  }
}
