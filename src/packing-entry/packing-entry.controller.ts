import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PackingEntryService } from './packing-entry.service';
import { CreatePackingEntryDto } from './dto/create-packing-entry.dto';
import { UpdatePackingEntryDto } from './dto/update-packing-entry.dto';
import { UpdatePackingEntryStatusDto } from './dto/update-status.dto';

@Controller('packing-entry')
export class PackingEntryController {
  constructor(private readonly service: PackingEntryService) {}

  @Patch('approve-grouped/:id')
  async approveGrouped(@Param('id') id: string) {
    return this.service.approveGrouped(Number(id));
  }

  @Patch('reject-grouped/:id')
  async rejectGrouped(@Param('id') id: string) {
    return this.service.rejectGrouped(Number(id));
  }

  @Patch('approve/:id')
  approveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackingEntryStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post()
  create(@Body() dto: CreatePackingEntryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackingEntryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
