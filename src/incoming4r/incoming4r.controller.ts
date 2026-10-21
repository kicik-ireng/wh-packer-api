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
import { Permissions } from '@vuteq/sso-client-nest';
import { Incoming4rService } from './incoming4r.service';
import { CreateIncoming4rDto } from './dto/create-incoming4r.dto';
import { UpdateIncoming4rDto } from './dto/update-incoming4r.dto';

@Controller('incoming4r')
export class Incoming4rController {
  constructor(private readonly service: Incoming4rService) {}

  @Post()
  @Permissions('PACKER.INCOMING4R_CREATE')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.service.create(file);
  }

  @Get()
  @Permissions('PACKER.INCOMING4R_READ')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @Permissions('PACKER.INCOMING4R_READ')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.INCOMING4R_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateIncoming4rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.INCOMING4R_DELETE')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post('import')
  @Permissions('PACKER.INCOMING4R_CREATE')
  async importExcel(@Body() data: CreateIncoming4rDto[]) {
    return this.service.bulkCreate(data);
  }

  @Post('manual')
  @Permissions('PACKER.INCOMING4R_CREATE')
  createManual(@Body() dto: CreateIncoming4rDto) {
    return this.service.manualCreate(dto);
  }
}
