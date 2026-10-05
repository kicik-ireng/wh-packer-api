import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduleCustomerDto } from './dto/create-schedule-customer.dto';
import { UpdateScheduleCustomerDto } from './dto/update-schedule-customer.dto';

@Injectable()
export class ScheduleCustomerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleCustomerDto) {
    // bulk create relasi customer
    const data = dto.customerIds.map((customerId) => ({
      scheduleTruckId: dto.scheduleTruckId,
      customerId,
    }));
    return this.prisma.scheduleCustomer.createMany({ data });
  }

  findAll() {
    return this.prisma.scheduleCustomer.findMany({
      include: { scheduleTruck: true, customer: true },
    });
  }

  findBySchedule(scheduleTruckId: number) {
    return this.prisma.scheduleCustomer.findMany({
      where: { scheduleTruckId },
      include: { customer: true },
    });
  }

  async update(id: number, dto: UpdateScheduleCustomerDto) {
    // delete existing relations
    await this.prisma.scheduleCustomer.deleteMany({
      where: { scheduleTruckId: dto.scheduleTruckId },
    });
    // create new relations
    const data = dto.customerIds.map((customerId) => ({
      scheduleTruckId: dto.scheduleTruckId,
      customerId,
    }));
    return this.prisma.scheduleCustomer.createMany({ data });
  }

  remove(id: number) {
    return this.prisma.scheduleCustomer.delete({ where: { id } });
  }
}
