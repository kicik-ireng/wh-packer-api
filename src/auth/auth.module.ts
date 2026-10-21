import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthorizationService } from './authorization.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthorizationService, PrismaService],
  exports: [AuthorizationService],
})
export class AuthModule {}
