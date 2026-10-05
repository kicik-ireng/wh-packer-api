import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStockOpnameDto {
  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsInt()
  qtySystem: number;

  @IsInt()
  qtyActual: number;

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
