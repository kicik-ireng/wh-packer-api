import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ManpowerService } from './manpower.service';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('manpower')
export class ManpowerController {
  constructor(private readonly manpowerService: ManpowerService) {}

  @Post()
  create(@Body() createManpowerDto: CreateManpowerDto) {
    return this.manpowerService.create(createManpowerDto);
  }

  @Get()
  findAll() {
    return this.manpowerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manpowerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManpowerDto: UpdateManpowerDto,
  ) {
    return this.manpowerService.update(id, updateManpowerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.manpowerService.remove(id);
  }
}
