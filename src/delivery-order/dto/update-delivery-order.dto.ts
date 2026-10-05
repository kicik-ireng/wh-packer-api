//   CreateDeliveryOrderDto,

import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryOrderDto } from './create-delivery-order.dto';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateDeliveryOrderDto extends PartialType(
  CreateDeliveryOrderDto,
) {
  @IsOptional()
  @IsDateString()
  deliverytime?: string; // ISO string
}
