//   IsArray,
//   IsInt,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from "class-validator";

//   part2rId?: number;

//   part4rId?: number;

//   qtyDelivered: number;

//   noDo: string;

//   driverId: number;

//   customerId?: number;

//   date?: Date;

//   items: DeliveryItemDto[];

import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryItemDto {
  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsInt()
  qtyDelivered: number;
}

export class CreateDeliveryOrderDto {
  @IsString()
  @IsNotEmpty()
  noDo: string;

  @IsInt()
  driverId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerId?: number;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  items: DeliveryItemDto[];

  @IsOptional()
  @IsDateString()
  DeliveryTime?: Date;

  @IsOptional()
  @IsInt()
  scheduleId?: number;
}
