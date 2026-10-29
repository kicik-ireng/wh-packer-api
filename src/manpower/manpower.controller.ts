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
import { Permissions, Public } from '@vuteq/sso-client-nest';
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

  @Public()
  @Get()
  findAll() {
    return this.manpowerService.findAll();
  }

  @Public()
  @Get(':id')
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
