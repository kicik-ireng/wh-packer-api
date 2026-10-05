import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePackingEntryDto {
  @IsInt()
  packingReportId: number;

  @IsInt()
  no: number;

  @IsString()
  jamMulai: string;

  @IsString()
  jamSelesai: string;

  @IsInt()
  menitPacking: number;

  @IsString()
  packingReqNo: string;

  @IsString()
  explannerNo: string;

  @IsString()
  customerPartNo: string;

  @IsInt()
  qtyPlan: number;

  @IsString()
  qtyActualPacking: string;

  @IsInt()
  balancePlanVsActual: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsInt()
  Incoming4rId?: number;

  @IsOptional()
  @IsInt()
  Incoming2rId?: number;

  @IsOptional()
  @IsInt()
  part2rId?: number;

  @IsOptional()
  @IsInt()
  part4rId?: number;

  @IsOptional()
  @IsInt()
  pic1Id?: number;

  @IsOptional()
  @IsInt()
  pic2Id?: number;

  @IsOptional()
  @IsInt()
  pic3Id?: number;
}
