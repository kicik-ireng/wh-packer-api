import { Module } from '@nestjs/common';
import { PackingReportService } from './packing-report.service';
import { PackingReportController } from './packing-report.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PackingReportController],
  providers: [PackingReportService, PrismaService],
})
export class PackingReportModule {}
