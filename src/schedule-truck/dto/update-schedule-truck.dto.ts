import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleTruckDto } from './create-schedule-truck.dto';

export class UpdateScheduleTruckDto extends PartialType(
  CreateScheduleTruckDto,
) {}
