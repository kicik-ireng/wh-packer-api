import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ScheduleCustomerService } from './schedule-customer.service';
import { CreateScheduleCustomerDto } from './dto/create-schedule-customer.dto';
import { UpdateScheduleCustomerDto } from './dto/update-schedule-customer.dto';

@Controller('schedule-customer')
export class ScheduleCustomerController {
  constructor(
    private readonly scheduleCustomerService: ScheduleCustomerService,
  ) {}

  @Post()
  create(@Body() dto: CreateScheduleCustomerDto) {
    return this.scheduleCustomerService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleCustomerService.findAll();
  }

  @Get('schedule/:scheduleTruckId')
  findBySchedule(@Param('scheduleTruckId') scheduleTruckId: string) {
    return this.scheduleCustomerService.findBySchedule(+scheduleTruckId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleCustomerDto) {
    return this.scheduleCustomerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleCustomerService.remove(+id);
  }
}
