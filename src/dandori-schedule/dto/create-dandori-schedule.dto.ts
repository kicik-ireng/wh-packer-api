import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDandoriScheduleDto {
  @IsNotEmpty()
  @IsString()
  scheduleDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  lineNo: string; // e.g. "1", "2", ... "8"

  @IsOptional()
  @IsString()
  shift?: string;

  @IsNotEmpty()
  @IsString()
  type: string; // "2R" | "4R"

  @IsOptional()
  @IsNumber()
  pic1Id?: number;

  @IsOptional()
  @IsNumber()
  pic2Id?: number;

  @IsOptional()
  @IsNumber()
  pic3Id?: number;

  @IsNotEmpty()
  @IsString()
  packingReqNo: string;

  @IsOptional()
  @IsString()
  customerPartNo?: string;

  @IsOptional()
  @IsString()
  explannerNo?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsNumber()
  Incoming2rId?: number;

  @IsOptional()
  @IsNumber()
  Incoming4rId?: number;

  @IsOptional()
  @IsNumber()
  part2rId?: number;

  @IsOptional()
  @IsNumber()
  part4rId?: number;

  @IsNotEmpty()
  @IsNumber()
  qtyPlan: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
