import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { StockOpnameService } from './stock-opname.service';
import { CreateStockOpnameDto } from './dto/create-stock-opname.dto';
import { UpdateStockOpnameDto } from './dto/update-stock-opname.dto';

@Controller('stock-opname')
export class StockOpnameController {
  constructor(private readonly stockOpnameService: StockOpnameService) {}

  @Post()
  @Permissions('PACKER.STOCK_OPNAME_CREATE')
  create(@Body() createStockOpnameDto: any) {
    return this.stockOpnameService.create(createStockOpnameDto);
  }

  @Get()
  @Permissions('PACKER.STOCK_OPNAME_READ')
  findAll() {
    return this.stockOpnameService.findAll();
  }

  @Get('summary')
  @Permissions('PACKER.STOCK_OPNAME_READ')
  getSummary() {
    return this.stockOpnameService.getSummary();
  }

  @Get(':id')
  @Permissions('PACKER.STOCK_OPNAME_READ')
  findOne(@Param('id') id: string) {
    return this.stockOpnameService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('PACKER.STOCK_OPNAME_UPDATE')
  update(@Param('id') id: string, @Body() updateStockOpnameDto: UpdateStockOpnameDto) {
    return this.stockOpnameService.update(+id, updateStockOpnameDto);
  }

  @Delete(':id')
  @Permissions('PACKER.STOCK_OPNAME_DELETE')
  remove(@Param('id') id: string) {
    return this.stockOpnameService.remove(+id);
  }
}
