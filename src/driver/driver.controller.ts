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
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @Permissions('PACKER.DRIVER_CREATE')
  create(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

  @Get()
  @Permissions('PACKER.DRIVER_READ')
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  @Permissions('PACKER.DRIVER_READ')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
  }

  @Put(':id')
  @Permissions('PACKER.DRIVER_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driverService.update(+id, dto);
  }

  @Patch(':id')
  @Permissions('PACKER.DRIVER_UPDATE')
  patch(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driverService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.DRIVER_DELETE')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
