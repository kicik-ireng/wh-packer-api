import { IsString } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  noPol: string;

  @IsString()
  color: string;
}
