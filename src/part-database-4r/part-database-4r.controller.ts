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
import { PartDatabase4rService } from './part-database-4r.service';
import { CreatePartDatabase4rDto } from './dto/create-part-database-4r.dto';
import { UpdatePartDatabase4rDto } from './dto/update-part-database-4r.dto';

@Controller('part-database-4r')
export class PartDatabase4rController {
  constructor(private readonly service: PartDatabase4rService) {}

  @Post()
  create(@Body() dto: CreatePartDatabase4rDto) {
    return this.service.create(dto);
  }
  // ✅ Bulk insert endpoint
  @Post('bulk')
  createMany(@Body() dtos: CreatePartDatabase4rDto[]) {
    return this.service.createMany(dtos);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartDatabase4rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
