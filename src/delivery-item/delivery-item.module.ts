import { Module } from '@nestjs/common';
import { DeliveryItemService } from './delivery-item.service';
import { DeliveryItemController } from './delivery-item.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DeliveryItemController],
  providers: [DeliveryItemService, PrismaService],
})
export class DeliveryItemModule {}
