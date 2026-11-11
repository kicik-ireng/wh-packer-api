import { Module } from '@nestjs/common';
import { DashboardAdminController } from './dashboard-admin.controller';
import { DashboardAdminService } from './dashboard-admin.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DashboardAdminController],
  providers: [DashboardAdminService, PrismaService],
  exports: [DashboardAdminService],
})
export class DashboardAdminModule {}
