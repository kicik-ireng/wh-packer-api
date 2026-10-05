import { Module } from '@nestjs/common';
import { ManpowerService } from './manpower.service';
import { ManpowerController } from './manpower.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ManpowerController],
  providers: [ManpowerService, PrismaService],
})
export class ManpowerModule {}
