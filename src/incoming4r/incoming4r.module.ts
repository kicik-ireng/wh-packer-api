import { Module } from '@nestjs/common';
import { Incoming4rService } from './incoming4r.service';
import { Incoming4rController } from './incoming4r.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { ExcelService } from '../utils/excel.service';

@Module({
  controllers: [Incoming4rController],
  providers: [Incoming4rService, PrismaService, ExcelService],
})
export class Incoming4rModule {}
