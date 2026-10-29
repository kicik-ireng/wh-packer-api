import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Res,
  Patch,
} from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { DeliveryOrderService } from './delivery-order.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { Response } from 'express';

@Controller('delivery-order')
export class DeliveryOrderController {
  constructor(private readonly service: DeliveryOrderService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateDeliveryOrderDto) {
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
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  @Permissions('PACKER.DELIVERY_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('export-excel/:date')
  @Permissions('PACKER.DELIVERY_READ')
  async exportExcel(
    @Param('date') date: string,
    @Query('type') type: 'ALL' | '2R' | '4R' = 'ALL',
    @Res() res: Response,
  ) {
    return this.service.exportToExcelByDate(date, type, res);
  }

  @Public()
  @Put(':id')
  updateDeliveryOrder(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderDto,
  ) {
    return this.service.update(+id, dto);
  }

  @Public()
  @Patch(':id')
  updateDeliveryTime(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderDto,
  ) {
    return this.service.update(+id, dto);
  }
}
