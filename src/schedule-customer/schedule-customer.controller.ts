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
import { ScheduleCustomerService } from './schedule-customer.service';
import { CreateScheduleCustomerDto } from './dto/create-schedule-customer.dto';
import { UpdateScheduleCustomerDto } from './dto/update-schedule-customer.dto';

@Controller('schedule-customer')
export class ScheduleCustomerController {
  constructor(
    private readonly scheduleCustomerService: ScheduleCustomerService,
  ) {}

  @Post()
  @Permissions('PACKER.SCHEDULE_TRUCK_CREATE')
  create(@Body() dto: CreateScheduleCustomerDto) {
    return this.scheduleCustomerService.create(dto);
  }

  @Get()
  @Permissions('PACKER.SCHEDULE_TRUCK_READ')
  findAll() {
    return this.scheduleCustomerService.findAll();
  }

  @Get('schedule/:scheduleTruckId')
  @Permissions('PACKER.SCHEDULE_TRUCK_READ')
  findBySchedule(@Param('scheduleTruckId') scheduleTruckId: string) {
    return this.scheduleCustomerService.findBySchedule(+scheduleTruckId);
  }

  @Put(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleCustomerDto) {
    return this.scheduleCustomerService.update(+id, dto);
  }

  @Patch(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_UPDATE')
  patch(@Param('id') id: string, @Body() dto: UpdateScheduleCustomerDto) {
    return this.scheduleCustomerService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.SCHEDULE_TRUCK_DELETE')
  remove(@Param('id') id: string) {
    return this.scheduleCustomerService.remove(+id);
  }
}
