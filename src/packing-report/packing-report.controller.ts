import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from '@vuteq/sso-client-nest';
import { PackingReportService } from './packing-report.service';
import { CreatePackingReportDto } from './dto/create-packing-report.dto';
import { UpdatePackingReportDto } from './dto/update-packing-report.dto';
import { Status } from '@prisma/client';

@Controller('packing-report')
export class PackingReportController {
  constructor(private readonly packingReportService: PackingReportService) {}

  @Post()
  @Permissions('PACKER.PACKING_REPORT_CREATE')
  create(@Body() createPackingReportDto: CreatePackingReportDto) {
    return this.packingReportService.create(createPackingReportDto);
  }

  @Get()
  @Permissions('PACKER.PACKING_REPORT_READ')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.packingReportService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @Permissions('PACKER.PACKING_REPORT_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packingReportService.findOne(id);
  }

  @Patch(':id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackingReportDto: UpdatePackingReportDto,
  ) {
    return this.packingReportService.update(id, updatePackingReportDto);
  }

  @Patch('approve/:id')
  @Permissions('PACKER.PACKING_REPORT_UPDATE')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackingReportDto: { status: Status },
  ) {
    return this.packingReportService.approve(id, updatePackingReportDto);
  }

  @Delete(':id')
  @Permissions('PACKER.PACKING_REPORT_DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packingReportService.remove(id);
  }

  @Get('export/:id')
  @Permissions('PACKER.PACKING_REPORT_READ')
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
