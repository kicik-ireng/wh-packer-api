import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdatePackingEntryStatusDto {
  @IsEnum(Status)
  status: Status;
}
