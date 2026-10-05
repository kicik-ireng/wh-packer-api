import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Response } from 'express';
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('2r')
  findStock2r() {
    return this.stockService.findStock2r();
  }

  @Get('4r')
  findStock4r() {
    return this.stockService.findStock4r();
  }

  @Patch(':type/rack/:id')
  async updateRack(
    @Param('id') id: string,
    @Param('type') type: '2r' | '4r',
    @Body() body: UpdateStockDto,
  ) {
    return this.stockService.updateRack(+id, body.rack, type);
  }
  @Get('export/2r')
  async export2r(@Res() res: Response) {
    return this.stockService.exportStock2rToExcel(res);
  }

  @Get('export/4r')
  async export4r(@Res() res: Response) {
    return this.stockService.exportStock4rToExcel(res);
  }

  // 2R
  @Post('update-part-2r')
  async updatePart2R(
    @Body('partId') partId: number,
    @Body('newQty') newQty: number,
  ) {
    return this.stockService.updateStockPerPart2R(partId, newQty);
  }

  // 4R
  @Post('update-part-4r')
  async updatePart4R(
    @Body('partId') partId: number,
    @Body('newQty') newQty: number,
  ) {
    return this.stockService.updateStockPerPart4R(partId, newQty);
  }
}
