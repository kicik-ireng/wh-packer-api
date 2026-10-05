//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
//   Header,
//   Query,
//   Res,
// } from '@nestjs/common';

//   [x: string]: any;

//     return this.service.create(dto);

//     return this.service.findAll();

//     return this.service.findOne(+id);

//     return this.service.update(+id, dto);

//     return this.service.remove(+id);

//     return this.service.exportToExcelByDate(date, type, res);

//   updateDeliveryOrder(

//     return this.service.update(+id, dto);

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Header,
  Query,
  Res,
  Patch,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DeliveryOrderService } from './delivery-order.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { Response } from 'express';

@Controller('delivery-order')
export class DeliveryOrderController {
  [x: string]: any;
  constructor(private readonly service: DeliveryOrderService) {}

  @Post()
  create(@Body() dto: CreateDeliveryOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  //   return this.service.update(+id, dto);

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('export-excel/:date')
  async exportExcel(
    @Param('date') date: string,
    @Query('type') type: 'ALL' | '2R' | '4R' = 'ALL',
    @Res() res: Response,
  ) {
    return this.service.exportToExcelByDate(date, type, res);
  }

  //   return this.service.update(+id, { driverId: dto.driverId });

  @Put(':id')
  updateDeliveryOrder(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderDto,
  ) {
    return this.service.update(+id, dto);
  }

  @Patch(':id')
  updateDeliveryTime(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderDto,
  ) {
    return this.service.update(+id, dto);
  }

  //   console.log('orderIds received:', orderIds); // check 1

  //     throw new BadRequestException('No orderIds provided');

  //   const orders = await this.service.findManyWithRelations(orderIds);
  //   console.log('orders fetched:', orders);

  //   const message = this.service.generateWAMessage(orders);
  //   console.log('WA message:', message);

  //   return { success: true, message };
}
