import { Module } from '@nestjs/common';
import { ScheduleCustomerService } from './schedule-customer.service';
import { ScheduleCustomerController } from './schedule-customer.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ScheduleCustomerController],
  providers: [ScheduleCustomerService, PrismaService],
  exports: [ScheduleCustomerService],
})
export class ScheduleCustomerModule {}
