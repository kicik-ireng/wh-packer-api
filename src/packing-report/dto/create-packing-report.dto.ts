import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePackingEntryDto } from '../../packing-entry/dto/create-packing-entry.dto';

export class CreatePackingReportDto {
  @IsDateString()
  tanggalPacking: string;

  @IsString()
  lineNo: string;

  @IsOptional()
  @IsInt()
  pic1Id?: number;

  @IsOptional()
  @IsInt()
  pic2Id?: number;

  @IsOptional()
  @IsInt()
  pic3Id?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  qty4R?: string;

  @IsOptional()
  @IsString()
  qty2R?: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePackingEntryDto)
  @IsArray()
  entries: CreatePackingEntryDto[];
}
