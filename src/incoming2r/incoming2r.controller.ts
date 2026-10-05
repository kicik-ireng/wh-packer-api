import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Incoming2rService } from './incoming2r.service';
import { UpdateIncoming2rDto } from './dto/update-incoming2r.dto';
import { CreateIncoming2rDto } from './dto/create-incoming2r.dto';

@Controller('incoming2r')
export class Incoming2rController {
  constructor(private readonly service: Incoming2rService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.service.create(file);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIncoming2rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  //   return this.service.getFilteredPackingReqNo();

  @Get('/packing-req-no')
  async getPackingReqNo() {
    return this.service.getFilteredPackingReqNo();
  }

  @Get('/update-status')
  async updateStatus() {
    return this.service.updateIncomingStatusFromPackingReport();
  }

  @Post('import')
  async importExcel(@Body() data: CreateIncoming2rDto[]) {
    return this.service.bulkCreate(data);
  }
  @Post('manual')
  createManual(@Body() dto: CreateIncoming2rDto) {
    return this.service.manualCreate(dto);
  }
}
