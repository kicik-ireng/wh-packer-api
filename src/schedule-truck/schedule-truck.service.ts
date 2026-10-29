import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduleTruckDto } from './dto/create-schedule-truck.dto';
import { UpdateScheduleTruckDto } from './dto/update-schedule-truck.dto';
import { format } from 'date-fns';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ScheduleTruckService {
  private readonly logger = new Logger(ScheduleTruckService.name);

  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async create(dto: CreateScheduleTruckDto) {
    try {
      const schedule = await this.prisma.scheduleTruck.create({
        data: {
          truckId: dto.truckId,
          driverId: dto.driverId,
          scheduleAt: new Date(dto.scheduleAt),
          cycle: dto.cycle ? Number(dto.cycle) : undefined,
          customers: {
            create: (dto.customerIds ?? []).map((id) => ({ customerId: id })),
          },
        },
        include: {
          truck: true,
          driver: true,
          customers: { include: { customer: true } },
          deliveryOrders: true,
        },
      });

      return schedule;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error creating schedule truck:', error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal membuat jadwal truk',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.scheduleTruck.findMany({
        include: {
          truck: true,
          driver: true,
          customers: { include: { customer: true } },
          deliveryOrders: true,
        },
        orderBy: { scheduleAt: 'desc' },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching schedule truck list:', error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal mengambil data jadwal truk',
      );
    }
  }

  async findOne(id: number) {
    try {
      const schedule = await this.prisma.scheduleTruck.findUnique({
        where: { id },
        include: {
          truck: true,
          driver: true,
          customers: { include: { customer: true } },
          deliveryOrders: true,
        },
      });
      if (!schedule)
        throw new NotFoundException(`Jadwal truk dengan ID ${id} tidak ditemukan`);
      return schedule;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error fetching schedule truck ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal mengambil detail jadwal truk',
      );
    }
  }

  async update(id: number, dto: UpdateScheduleTruckDto) {
    try {
      await this.findOne(id);
      return await this.prisma.scheduleTruck.update({
        where: { id },
        data: {
          truckId: dto.truckId,
          driverId: dto.driverId,
          scheduleAt: dto.scheduleAt ? new Date(dto.scheduleAt) : undefined,
          customers: dto.customerIds
            ? {
                deleteMany: {},
                create: dto.customerIds.map((cId) => ({ customerId: cId })),
              }
            : undefined,
        },
        include: {
          truck: true,
          driver: true,
          customers: { include: { customer: true } },
          deliveryOrders: true,
        },
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating schedule truck ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal memperbarui jadwal truk',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return await this.prisma.$transaction(async (prisma) => {
        await prisma.scheduleCustomer.deleteMany({
          where: { scheduleTruckId: id },
        });

        await prisma.deliveryOrder.deleteMany({
          where: { scheduleId: id },
        });

        return await prisma.scheduleTruck.delete({
          where: { id },
        });
      });
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting schedule truck ${id}:`, error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal menghapus jadwal truk',
      );
    }
  }
}
