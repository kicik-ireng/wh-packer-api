import { IsInt, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateScheduleTruckDto {
  @IsInt()
  truckId: number;

  @IsInt()
  driverId: number;

  @IsArray()
  customerIds: number[];

  @IsDateString()
  scheduleAt: string;

  @IsOptional()
  @IsInt()
  cycle?: number;
}

export class UpdateScheduleTruckDto {
  @IsInt()
  truckId: number;

  @IsInt()
  driverId: number;

  @IsArray()
  customerIds: number[];

  @IsDateString()
  scheduleAt: string;

  @IsOptional()
  @IsInt()
  cycle?: number;
}
