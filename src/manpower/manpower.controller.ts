import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { ManpowerService } from './manpower.service';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Controller('manpower')
export class ManpowerController {
  constructor(private readonly manpowerService: ManpowerService) {}

  @Post()
  @Permissions('PACKER.MANPOWER_CREATE')
  create(@Body() createManpowerDto: CreateManpowerDto) {
    return this.manpowerService.create(createManpowerDto);
  }

  @Get()
  @Permissions('PACKER.MANPOWER_READ')
  findAll() {
    return this.manpowerService.findAll();
  }

  @Get(':id')
  @Permissions('PACKER.MANPOWER_READ')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manpowerService.findOne(id);
  }

  @Patch(':id')
  @Permissions('PACKER.MANPOWER_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManpowerDto: UpdateManpowerDto,
  ) {
    return this.manpowerService.update(id, updateManpowerDto);
  }

  @Delete(':id')
  @Permissions('PACKER.MANPOWER_DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.manpowerService.remove(id);
  }
}
