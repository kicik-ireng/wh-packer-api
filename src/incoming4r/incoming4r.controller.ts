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
import { Incoming4rService } from './incoming4r.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIncoming4rDto } from './dto/create-incoming4r.dto';
import { UpdateIncoming4rDto } from './dto/update-incoming4r.dto';

@Controller('incoming4r')
export class Incoming4rController {
  constructor(private readonly service: Incoming4rService) {}

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
  update(@Param('id') id: string, @Body() dto: UpdateIncoming4rDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
  @Post('import')
  async importExcel(@Body() data: CreateIncoming4rDto[]) {
    return this.service.bulkCreate(data);
  }
  @Post('manual')
  createManual(@Body() dto: CreateIncoming4rDto) {
    return this.service.manualCreate(dto);
  }
}
