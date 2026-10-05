import { Module } from '@nestjs/common';
import { PackingEntryService } from './packing-entry.service';
import { PackingEntryController } from './packing-entry.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PackingEntryController],
  providers: [PackingEntryService, PrismaService],
})
export class PackingEntryModule {}
