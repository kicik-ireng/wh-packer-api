import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DandoriScheduleService } from './dandori-schedule.service';
import { CreateDandoriScheduleDto } from './dto/create-dandori-schedule.dto';
import { UpdateDandoriScheduleDto } from './dto/update-dandori-schedule.dto';
import { Public } from '@vuteq/sso-client-nest';

@Controller('dandori-schedule')
export class DandoriScheduleController {
  constructor(
    private readonly dandoriScheduleService: DandoriScheduleService,
  ) {}

  @Public()
  @Post()
  create(@Body() createDto: CreateDandoriScheduleDto) {
    return this.dandoriScheduleService.create(createDto);
  }

  @Public()
  @Get('dashboard')
  getDashboardLines(@Query('date') date?: string) {
    return this.dandoriScheduleService.getDashboardLines(date);
  }

  @Public()
  @Get('active-line')
  findByLineAndDate(
    @Query('lineNo') lineNo: string,
    @Query('date') date: string,
  ) {
    return this.dandoriScheduleService.findByLineAndDate(lineNo, date);
  }

  @Public()
  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('lineNo') lineNo?: string,
    @Query('status') status?: string,
  ) {
    return this.dandoriScheduleService.findAll({ date, lineNo, status });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dandoriScheduleService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDandoriScheduleDto,
  ) {
    return this.dandoriScheduleService.update(+id, updateDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dandoriScheduleService.remove(+id);
  }
}
