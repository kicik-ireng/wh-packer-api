import { IsInt, IsOptional } from 'class-validator';

export class CreateDeliveryItemDto {
  @IsInt()
  deliveryOrderId: number;

  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsInt()
  qtyDelivered: number;
}
