import { Module } from '@nestjs/common';
import { DandoriScheduleService } from './dandori-schedule.service';
import { DandoriScheduleController } from './dandori-schedule.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DandoriScheduleController],
  providers: [DandoriScheduleService],
  exports: [DandoriScheduleService],
})
export class DandoriScheduleModule {}
