import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { StockTransactionService } from './stock-transaction.service';
import { CreateStockTransactionDto } from './dto/create-stock-transaction.dto';
import { UpdateStockTransactionDto } from './dto/update-stock-transaction.dto';

@Controller('stock-transaction')
export class StockTransactionController {
  constructor(private readonly stockTransactionService: StockTransactionService) {}

  @Post()
  @Permissions('PACKER.TRACEABILITY_READ')
  create(@Body() createStockTransactionDto: CreateStockTransactionDto) {
    return this.stockTransactionService.create(createStockTransactionDto);
  }

  @Get()
  @Permissions('PACKER.TRACEABILITY_READ')
  findAll(@Query() query: any) {
    return this.stockTransactionService.findAll(query);
  }

  @Get(':id')
  @Permissions('PACKER.TRACEABILITY_READ')
  findOne(@Param('id') id: string) {
    return this.stockTransactionService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.TRACEABILITY_READ')
  update(@Param('id') id: string, @Body() updateStockTransactionDto: UpdateStockTransactionDto) {
    return this.stockTransactionService.update(+id, updateStockTransactionDto);
  }

  @Delete(':id')
  @Permissions('PACKER.TRACEABILITY_READ')
  remove(@Param('id') id: string) {
    return this.stockTransactionService.remove(+id);
  }
}
