import { Module } from '@nestjs/common';
import { ScheduleTruckService } from './schedule-truck.service';
import { ScheduleTruckController } from './schedule-truck.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [ScheduleTruckController],
  providers: [ScheduleTruckService, PrismaService],
})
export class ScheduleTruckModule {}
