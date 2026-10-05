// part-database-2r/dto/update-part-database-2r.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePartDatabase2rDto } from './create-part-database-2r.dto';

export class UpdatePartDatabase2rDto extends PartialType(
  CreatePartDatabase2rDto,
) {}
