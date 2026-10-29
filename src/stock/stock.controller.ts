import { Body, Controller, Get, Param, Patch, Post, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Response } from 'express';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Public()
  @Get('2r')
  findStock2r() {
    return this.stockService.findStock2r();
  }

  @Public()
  @Get('4r')
  findStock4r() {
    return this.stockService.findStock4r();
  }

  @Patch(':type/rack/:id')
  @Permissions('PACKER.STOCK_UPDATE')
  async updateRack(
    @Param('id') id: string,
    @Param('type') type: '2r' | '4r',
    @Body() body: UpdateStockDto,
  ) {
    return this.stockService.updateRack(+id, body.rack, type);
  }

  @Get('export/2r')
  @Permissions('PACKER.STOCK_READ')
  async export2r(@Res() res: Response) {
    return this.stockService.exportStock2rToExcel(res);
  }

  @Get('export/4r')
  @Permissions('PACKER.STOCK_READ')
  async export4r(@Res() res: Response) {
    return this.stockService.exportStock4rToExcel(res);
  }

  // 2R
  @Post('update-part-2r')
  @Permissions('PACKER.STOCK_UPDATE')
  async updatePart2R(
    @Body('partId') partId: number,
    @Body('newQty') newQty: number,
  ) {
    return this.stockService.updateStockPerPart2R(partId, newQty);
  }

  // 4R
  @Post('update-part-4r')
  @Permissions('PACKER.STOCK_UPDATE')
  async updatePart4R(
    @Body('partId') partId: number,
    @Body('newQty') newQty: number,
  ) {
    return this.stockService.updateStockPerPart4R(partId, newQty);
  }

  @Post('upload/2r')
  @Permissions('PACKER.STOCK_UPDATE')
  @UseInterceptors(FileInterceptor('file'))
  async upload2r(@UploadedFile() file: Express.Multer.File) {
    return this.stockService.uploadStock2r(file);
  }

  @Post('upload/4r')
  @Permissions('PACKER.STOCK_UPDATE')
  @UseInterceptors(FileInterceptor('file'))
  async upload4r(@UploadedFile() file: Express.Multer.File) {
    return this.stockService.uploadStock4r(file);
  }
}
