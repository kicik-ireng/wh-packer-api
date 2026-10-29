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
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { ScheduleTruckService } from './schedule-truck.service';
import { CreateScheduleTruckDto } from './dto/create-schedule-truck.dto';
import { UpdateScheduleTruckDto } from './dto/update-schedule-truck.dto';

@Controller('schedule-truck')
export class ScheduleTruckController {
  constructor(private readonly scheduleTruckService: ScheduleTruckService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateScheduleTruckDto) {
    return this.scheduleTruckService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.scheduleTruckService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleTruckService.findOne(+id);
  }

  @Public()
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleTruckDto) {
    return this.scheduleTruckService.update(+id, dto);
  }

  @Public()
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateScheduleTruckDto) {
    return this.scheduleTruckService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_DELETE')
  remove(@Param('id') id: string) {
    return this.scheduleTruckService.remove(+id);
  }
}
