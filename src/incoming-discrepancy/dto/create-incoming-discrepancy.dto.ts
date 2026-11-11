import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIncomingDiscrepancyDto {
  @IsString()
  @IsNotEmpty()
  prId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // "2R" | "4R"

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsString()
  suratJalanNo?: string;

  @IsOptional()
  @IsString()
  partNo?: string;

  @IsOptional()
  @IsString()
  partName?: string;

  @IsNumber()
  @IsNotEmpty()
  qtySuratJalan: number;

  @IsNumber()
  @IsNotEmpty()
  qtyDiterimaFisik: number;

  @IsOptional()
  @IsString()
  discrepancyType?: string; // "BARANG_KURANG", "BARANG_RUSAK", "SALAH_PART", "LAINNYA"

  @IsOptional()
  @IsString()
  picInspector?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  Incoming2rId?: number;

  @IsOptional()
  @IsNumber()
  Incoming4rId?: number;
}

