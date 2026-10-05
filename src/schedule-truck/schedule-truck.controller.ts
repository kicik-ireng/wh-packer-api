import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ScheduleTruckService } from './schedule-truck.service';
import { CreateScheduleTruckDto } from './dto/create-schedule-truck.dto';
import { UpdateScheduleTruckDto } from './dto/update-schedule-truck.dto';

@Controller('schedule-truck')
export class ScheduleTruckController {
  constructor(private readonly scheduleTruckService: ScheduleTruckService) {}

  @Post()
  create(@Body() dto: CreateScheduleTruckDto) {
    return this.scheduleTruckService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleTruckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleTruckService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleTruckDto) {
    return this.scheduleTruckService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleTruckService.remove(+id);
  }
}
