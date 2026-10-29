import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({ data });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating customer:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal menambahkan customer');
    }
  }

  async findAll() {
    try {
      return await this.prisma.customer.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching customer list:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data customer');
    }
  }

  async findOne(id: number) {
    try {
      const customer = await this.prisma.customer.findUnique({ where: { id } });
      if (!customer) throw new NotFoundException(`Customer dengan ID ${id} tidak ditemukan`);
      return customer;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching customer ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil detail customer');
    }
  }

  async update(id: number, data: UpdateCustomerDto) {
    try {
      await this.findOne(id);
      return await this.prisma.customer.update({ where: { id }, data });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating customer ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal memperbarui data customer');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.customer.delete({ where: { id } });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting customer ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal menghapus customer');
    }
  }
}
