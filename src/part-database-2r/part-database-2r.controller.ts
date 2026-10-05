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
import { PartDatabase2rService } from './part-database-2r.service';
import { CreatePartDatabase2rDto } from './dto/create-part-database-2r.dto';
import { UpdatePartDatabase2rDto } from './dto/update-part-database-2r.dto';

@Controller('part-database-2r')
export class PartDatabase2rController {
  constructor(private readonly service: PartDatabase2rService) {}

  @Post()
  create(@Body() dto: CreatePartDatabase2rDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
  // ✅ Bulk insert endpoint
  @Post('bulk')
  createMany(@Body() dtos: CreatePartDatabase2rDto[]) {
    return this.service.createMany(dtos);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartDatabase2rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
