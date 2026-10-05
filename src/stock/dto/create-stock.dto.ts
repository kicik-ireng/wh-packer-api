import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStockDto {
  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsInt()
  totalStock: number;

  @IsOptional()
  @IsString()
  rack?: string;
}
