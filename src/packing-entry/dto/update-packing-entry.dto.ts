import { PartialType } from '@nestjs/mapped-types';
import { CreatePackingEntryDto } from './create-packing-entry.dto';

export class UpdatePackingEntryDto extends PartialType(CreatePackingEntryDto) {}
