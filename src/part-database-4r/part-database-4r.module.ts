// part-database-4r.module.ts
import { Module } from '@nestjs/common';
import { PartDatabase4rService } from './part-database-4r.service';
import { PartDatabase4rController } from './part-database-4r.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PartDatabase4rController],
  providers: [PartDatabase4rService, PrismaService],
})
export class PartDatabase4rModule {}
