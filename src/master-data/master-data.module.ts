import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MasterDataController],
  providers: [MasterDataService, PrismaService],
  exports: [MasterDataService],
})
export class MasterDataModule {}
