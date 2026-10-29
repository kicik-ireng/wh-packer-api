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
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { PackingEntryService } from './packing-entry.service';
import { CreatePackingEntryDto } from './dto/create-packing-entry.dto';
import { UpdatePackingEntryDto } from './dto/update-packing-entry.dto';
import { UpdatePackingEntryStatusDto } from './dto/update-status.dto';

@Controller('packing-entry')
export class PackingEntryController {
  constructor(private readonly service: PackingEntryService) {}

  @Patch('approve-grouped/:id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  async approveGrouped(@Param('id') id: string) {
    return this.service.approveGrouped(Number(id));
  }

  @Patch('reject-grouped/:id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  async rejectGrouped(@Param('id') id: string) {
    return this.service.rejectGrouped(Number(id));
  }

  @Patch('approve/:id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  approveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackingEntryStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post()
  @Permissions('PACKER.PACKING_REPORT_CREATE')
  create(@Body() dto: CreatePackingEntryDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePackingEntryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.PACKING_REPORT_DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
