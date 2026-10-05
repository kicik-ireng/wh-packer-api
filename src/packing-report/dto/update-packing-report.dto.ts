import { PartialType } from '@nestjs/mapped-types';
import { CreatePackingReportDto } from './create-packing-report.dto';
import { Status } from '@prisma/client';

export class UpdatePackingReportDto extends PartialType(
  CreatePackingReportDto,
) {
  status: Status;
}
