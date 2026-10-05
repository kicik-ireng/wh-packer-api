import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { PackingReportService } from './packing-report.service';
import { CreatePackingReportDto } from './dto/create-packing-report.dto';
import { UpdatePackingReportDto } from './dto/update-packing-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Status } from '@prisma/client';

@Controller('packing-report')
export class PackingReportController {
  constructor(private readonly packingReportService: PackingReportService) {}

  @Post()
  create(@Body() createPackingReportDto: CreatePackingReportDto) {
    return this.packingReportService.create(createPackingReportDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.packingReportService.findAll(pageNum, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packingReportService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackingReportDto: UpdatePackingReportDto,
  ) {
    return this.packingReportService.update(id, updatePackingReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('approve/:id')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackingReportDto: { status: Status },
  ) {
    return this.packingReportService.approve(id, updatePackingReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packingReportService.remove(id);
  }

  // Export Excel endpoint
  @UseGuards(JwtAuthGuard)
  @Get('export/:id')
  async exportReport(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const report = await this.packingReportService.findOneWithEntries(id);

    if (!report) {
      return res.status(404).json({ message: 'PackingReport not found' });
    }

    const buffer = await this.packingReportService.generateExcel(report);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="PackingReport-${id}.xlsx"`,
    });

    return res.send(buffer);
  }
}
