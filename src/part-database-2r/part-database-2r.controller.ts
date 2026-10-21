// part-database-2r.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { PartDatabase2rService } from './part-database-2r.service';
import { CreatePartDatabase2rDto } from './dto/create-part-database-2r.dto';
import { UpdatePartDatabase2rDto } from './dto/update-part-database-2r.dto';

@Controller('part-database-2r')
export class PartDatabase2rController {
  constructor(private readonly service: PartDatabase2rService) {}

  @Post()
  @Permissions('PACKER.PART2R_CREATE')
  create(@Body() dto: CreatePartDatabase2rDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('PACKER.PART2R_READ')
  findAll() {
    return this.service.findAll();
  }

  @Post('bulk')
  @Permissions('PACKER.PART2R_CREATE')
  createMany(@Body() dtos: CreatePartDatabase2rDto[]) {
    return this.service.createMany(dtos);
  }

  @Get(':id')
  @Permissions('PACKER.PART2R_READ')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.PART2R_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdatePartDatabase2rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.PART2R_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
