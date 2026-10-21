import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { TruckService } from './truck.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  @Permissions('PACKER.TRUCK_CREATE')
  create(@Body() dto: CreateTruckDto) {
    return this.truckService.create(dto);
  }

  @Get()
  @Permissions('PACKER.TRUCK_READ')
  findAll() {
    return this.truckService.findAll();
  }

  @Get(':id')
  @Permissions('PACKER.TRUCK_READ')
  findOne(@Param('id') id: string) {
    return this.truckService.findOne(+id);
  }

  @Put(':id')
  @Permissions('PACKER.TRUCK_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateTruckDto) {
    return this.truckService.update(+id, dto);
  }

  @Patch(':id')
  @Permissions('PACKER.TRUCK_UPDATE')
  patch(@Param('id') id: string, @Body() dto: UpdateTruckDto) {
    return this.truckService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.TRUCK_DELETE')
  remove(@Param('id') id: string) {
    return this.truckService.remove(+id);
  }
}
