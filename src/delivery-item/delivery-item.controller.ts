import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { DeliveryItemService } from './delivery-item.service';
import { CreateDeliveryItemDto } from './dto/create-delivery-item.dto';
import { UpdateDeliveryItemDto } from './dto/update-delivery-item.dto';

@Controller('delivery-item')
export class DeliveryItemController {
  constructor(private readonly service: DeliveryItemService) {}

  @Post()
  @Permissions('PACKER.DELIVERY_CREATE')
  create(@Body() dto: CreateDeliveryItemDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.DELIVERY_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryItemDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.DELIVERY_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
