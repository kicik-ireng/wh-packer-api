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
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { Incoming2rService } from './incoming2r.service';
import { UpdateIncoming2rDto } from './dto/update-incoming2r.dto';
import { CreateIncoming2rDto } from './dto/create-incoming2r.dto';

@Controller('incoming2r')
export class Incoming2rController {
  constructor(private readonly service: Incoming2rService) {}

  @Post()
  @Permissions('PACKER.INCOMING2R_CREATE')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.service.create(file);
  }

  @Public()
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Public()
  @Get('packing-req-no')
  async getPackingReqNo() {
    return this.service.getFilteredPackingReqNo();
  }

  @Public()
  @Get('update-status')
  async updateStatus() {
    return this.service.updateIncomingStatusFromPackingReport();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.INCOMING2R_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateIncoming2rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.INCOMING2R_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post('import')
  @Permissions('PACKER.INCOMING2R_CREATE')
  async importExcel(@Body() data: CreateIncoming2rDto[]) {
    return this.service.bulkCreate(data);
  }

  @Post('manual')
  @Permissions('PACKER.INCOMING2R_CREATE')
  createManual(@Body() dto: CreateIncoming2rDto) {
    return this.service.manualCreate(dto);
  }
}
