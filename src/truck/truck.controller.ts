import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TruckService } from './truck.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  create(@Body() dto: CreateTruckDto) {
    return this.truckService.create(dto);
  }

  @Get()
  findAll() {
    return this.truckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.truckService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTruckDto) {
    return this.truckService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.truckService.remove(+id);
  }
}
