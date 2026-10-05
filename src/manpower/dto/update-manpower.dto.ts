import { IsOptional, IsString } from 'class-validator';

export class UpdateManpowerDto {
  @IsOptional()
  @IsString()
  nik?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
