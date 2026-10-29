import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Injectable()
export class ManpowerService {
  private readonly logger = new Logger(ManpowerService.name);

  constructor(private prisma: PrismaService) {}

  async create(createManpowerDto: CreateManpowerDto) {
    try {
      return await this.prisma.manpower.create({
        data: createManpowerDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating manpower:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal menambahkan manpower');
    }
  }

  async findAll() {
    try {
      return await this.prisma.manpower.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching manpower list:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data manpower');
    }
  }

  async findOne(id: number) {
    try {
      const manpower = await this.prisma.manpower.findUnique({ where: { id } });
      if (!manpower) throw new NotFoundException(`Manpower ID ${id} tidak ditemukan`);
      return manpower;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching manpower ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil detail manpower');
    }
  }

  async update(id: number, updateManpowerDto: UpdateManpowerDto) {
    try {
      await this.findOne(id);
      return await this.prisma.manpower.update({
        where: { id },
        data: updateManpowerDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating manpower ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal memperbarui data manpower');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.manpower.delete({ where: { id } });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting manpower ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal menghapus manpower');
    }
  }
}
