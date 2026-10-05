import { IsInt } from 'class-validator';

export class UpdateScheduleCustomerDto {
  @IsInt()
  scheduleTruckId: number;

  @IsInt({ each: true })
  customerIds: number[];
}
