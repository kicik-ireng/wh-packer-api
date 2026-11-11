import { Module } from '@nestjs/common';
import { IncomingDiscrepancyController } from './incoming-discrepancy.controller';
import { IncomingDiscrepancyService } from './incoming-discrepancy.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [IncomingDiscrepancyController],
  providers: [IncomingDiscrepancyService, PrismaService],
  exports: [IncomingDiscrepancyService],
})
export class IncomingDiscrepancyModule {}

