// part-database-4r.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { PartDatabase4rService } from './part-database-4r.service';
import { CreatePartDatabase4rDto } from './dto/create-part-database-4r.dto';
import { UpdatePartDatabase4rDto } from './dto/update-part-database-4r.dto';

@Controller('part-database-4r')
export class PartDatabase4rController {
  constructor(private readonly service: PartDatabase4rService) {}

  @Post()
  @Permissions('PACKER.PART4R_CREATE')
  create(@Body() dto: CreatePartDatabase4rDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  @Permissions('PACKER.PART4R_CREATE')
  createMany(@Body() dtos: CreatePartDatabase4rDto[]) {
    return this.service.createMany(dtos);
  }

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.PART4R_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdatePartDatabase4rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.PART4R_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
