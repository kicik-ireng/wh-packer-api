import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductionProblemDto {
  @IsInt()
  no: number;

  @IsDateString()
  jamMulai: string;

  @IsDateString()
  jamSelesai: string;

  @IsInt()
  menit: number;

  @IsString()
  problemItem: string;

  @IsString()
  pic: string;

  @IsString()
  slOrDl: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
