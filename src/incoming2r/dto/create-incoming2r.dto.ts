import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateIncoming2rDto {
  @IsString()
  prId: string;

  @IsString()
  date: string;
  @IsString()
  cust: string;

  @IsString()
  segment: string;

  @IsString()
  assyNo16: string;

  @IsString()
  assyNo10: string;

  @IsString()
  oeNo: string;

  @IsString()
  model: string;

  @IsString()
  EMIpartname: string;

  @IsString()
  kpp: string;

  @IsInt()
  qtyPlan: number;

  @IsOptional()
  @IsInt()
  qtyActual?: number;
}
