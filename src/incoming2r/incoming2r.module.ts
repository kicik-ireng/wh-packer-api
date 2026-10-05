import { Module } from '@nestjs/common';
import { Incoming2rService } from './incoming2r.service';
import { Incoming2rController } from './incoming2r.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { ExcelService } from '../utils/excel.service';

@Module({
  controllers: [Incoming2rController],
  providers: [Incoming2rService, PrismaService, ExcelService],
})
export class Incoming2rModule {}
