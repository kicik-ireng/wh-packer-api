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
import { ScheduleTruckService } from './schedule-truck.service';
import { CreateScheduleTruckDto } from './dto/create-schedule-truck.dto';
import { UpdateScheduleTruckDto } from './dto/update-schedule-truck.dto';

@Controller('schedule-truck')
export class ScheduleTruckController {
  constructor(private readonly scheduleTruckService: ScheduleTruckService) {}

  @Post()
  @Permissions('PACKER.SCHEDULE_TRUCK_CREATE')
  create(@Body() dto: CreateScheduleTruckDto) {
    return this.scheduleTruckService.create(dto);
  }

  @Get()
  @Permissions('PACKER.SCHEDULE_TRUCK_READ')
  findAll() {
    return this.scheduleTruckService.findAll();
  }

  @Get(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_READ')
  findOne(@Param('id') id: string) {
    return this.scheduleTruckService.findOne(+id);
  }

  @Put(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleTruckDto) {
    return this.scheduleTruckService.update(+id, dto);
  }

  @Patch(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_UPDATE')
  patch(@Param('id') id: string, @Body() dto: UpdateScheduleTruckDto) {
    return this.scheduleTruckService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_DELETE')
  remove(@Param('id') id: string) {
    return this.scheduleTruckService.remove(+id);
  }
}
