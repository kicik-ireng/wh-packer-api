import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MonthlyRekapService } from './monthly-rekap.service';
import { MonthlyRekapController } from './monthly-rekap.controller';

@Module({
  providers: [MonthlyRekapService, PrismaService],
  controllers: [MonthlyRekapController],
  exports: [MonthlyRekapService],
})
export class MonthlyRekapModule {}
