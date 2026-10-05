import { Module } from '@nestjs/common';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrderService } from './delivery-order.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [DeliveryOrderController],
  providers: [DeliveryOrderService],
})
export class DeliveryOrderModule {}
