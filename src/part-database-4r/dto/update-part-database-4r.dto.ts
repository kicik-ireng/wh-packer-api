import { PartialType } from '@nestjs/mapped-types';
import { CreatePartDatabase4rDto } from './create-part-database-4r.dto';

export class UpdatePartDatabase4rDto extends PartialType(
  CreatePartDatabase4rDto,
) {}
