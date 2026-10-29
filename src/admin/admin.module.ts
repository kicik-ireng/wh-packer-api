import { Module } from '@nestjs/common';
import {
  UsersController,
  RolesController,
  PermissionsController,
} from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [UsersController, RolesController, PermissionsController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
