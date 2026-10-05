// part-database-2r.module.ts
import { Module } from '@nestjs/common';
import { PartDatabase2rService } from './part-database-2r.service';
import { PartDatabase2rController } from './part-database-2r.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PartDatabase2rController],
  providers: [PartDatabase2rService, PrismaService],
})
export class PartDatabase2rModule {}
