import { IsOptional, IsString } from 'class-validator';

export class UpdateIncomingDiscrepancyDto {
  @IsOptional()
  @IsString()
  status?: string; // "RECORDED", "CLAIM_SUBMITTED", "RESOLVED"

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  picInspector?: string;
}

