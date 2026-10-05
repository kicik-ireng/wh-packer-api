import { Module } from '@nestjs/common';
import { PicRekapService } from './pic-rekap.service';
import { PicRekapController } from './pic-rekap.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PicRekapController],
  providers: [PicRekapService, PrismaService],
  exports: [PicRekapService],
})
export class PicRekapModule {}
