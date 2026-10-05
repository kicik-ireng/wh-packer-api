import { PartialType } from '@nestjs/mapped-types';
import { CreateIncoming2rDto } from './create-incoming2r.dto';

export class UpdateIncoming2rDto extends PartialType(CreateIncoming2rDto) {}
