import { PartialType } from '@nestjs/mapped-types';
import { CreateIncoming4rDto } from './create-incoming4r.dto';

export class UpdateIncoming4rDto extends PartialType(CreateIncoming4rDto) {}
