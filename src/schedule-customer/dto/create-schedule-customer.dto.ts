import { IsInt } from 'class-validator';

export class CreateScheduleCustomerDto {
  @IsInt()
  scheduleTruckId: number;

  @IsInt({ each: true })
  customerIds: number[];
}
