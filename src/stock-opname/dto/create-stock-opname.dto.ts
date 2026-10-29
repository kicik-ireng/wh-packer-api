import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStockOpnameDto {
  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsOptional()
  @IsInt()
  qtyBeginning?: number;

  @IsOptional()
  @IsInt()
  qtyIn?: number;

  @IsOptional()
  @IsInt()
  qtyOut?: number;

  @IsInt()
  qtySystem: number;

  @IsInt()
  qtyActual: number;

  @IsOptional()
  @IsInt()
  qtyDiff?: number;

  @IsOptional()
  @IsString()
  rack?: string;

  @IsOptional()
  @IsString()
  picStockist?: string;

  @IsOptional()
  @IsString()
  picApproved?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  pic?: string;

  @IsOptional()
  @IsString()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

