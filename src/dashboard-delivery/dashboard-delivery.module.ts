import { Module } from '@nestjs/common';
import { DashboardDeliveryController } from './dashboard-delivery.controller';
import { DashboardDeliveryService } from './dashboard-delivery.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DashboardDeliveryController],
  providers: [DashboardDeliveryService, PrismaService],
})
export class DashboardDeliveryModule {}
