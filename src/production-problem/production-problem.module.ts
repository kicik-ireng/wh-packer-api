import { Module } from '@nestjs/common';
import { ProductionProblemService } from './production-problem.service';
import { ProductionProblemController } from './production-problem.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductionProblemController],
  providers: [ProductionProblemService, PrismaService],
})
export class ProductionProblemModule {}
