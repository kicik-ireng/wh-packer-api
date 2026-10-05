import { Module } from '@nestjs/common';
import { TruckService } from './truck.service';
import { TruckController } from './truck.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TruckController],
  providers: [TruckService, PrismaService],
})
export class TruckModule {}
