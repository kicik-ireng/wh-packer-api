import { IsString } from 'class-validator';

export class CreateManpowerDto {
  @IsString()
  nik: string;

  @IsString()
  name: string;
}
