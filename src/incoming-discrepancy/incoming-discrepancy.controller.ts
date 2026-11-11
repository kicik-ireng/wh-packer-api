import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IncomingDiscrepancyService } from './incoming-discrepancy.service';
import { CreateIncomingDiscrepancyDto } from './dto/create-incoming-discrepancy.dto';
import { UpdateIncomingDiscrepancyDto } from './dto/update-incoming-discrepancy.dto';

@Controller('incoming-discrepancy')
export class IncomingDiscrepancyController {
  constructor(private readonly service: IncomingDiscrepancyService) {}

  @Post()
  create(@Body() dto: CreateIncomingDiscrepancyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('prId') prId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findAll({ prId, type, status, startDate, endDate });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIncomingDiscrepancyDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

