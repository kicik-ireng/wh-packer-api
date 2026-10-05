import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateStockDto {
  @IsOptional()
  @IsInt()
  totalStock?: number;

  @IsString()
  rack: string;
}
