import { PartialType } from '@nestjs/mapped-types';
import { CreateDandoriScheduleDto } from './create-dandori-schedule.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDandoriScheduleDto extends PartialType(CreateDandoriScheduleDto) {
  @IsOptional()
  @IsNumber()
  qtyActual?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
