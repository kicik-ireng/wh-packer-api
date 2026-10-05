import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateIncoming4rDto {
  @IsString()
  prId: string;
  @IsString()
  date: string;
  @IsString()
  cust: string;

  @IsString()
  seg: string;

  @IsString()
  assyNo16: string;
  @IsString()
  assyNo10: string;
  @IsString()
  oeNo: string;

  @IsString()
  model: string;

  @IsString()
  kpp: string;

  @IsString()
  kppNp: string;

  @IsInt()
  qtyPlan: number;

  @IsOptional()
  @IsInt()
  qtyActual?: number;
}
