import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionProblemDto } from './create-production-problem.dto';

export class UpdateProductionProblemDto extends PartialType(
  CreateProductionProblemDto,
) {}
