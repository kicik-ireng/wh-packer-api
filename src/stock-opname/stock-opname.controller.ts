import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockOpnameService } from './stock-opname.service';
import { CreateStockOpnameDto } from './dto/create-stock-opname.dto';
import { UpdateStockOpnameDto } from './dto/update-stock-opname.dto';

@Controller('stock-opname')
export class StockOpnameController {
  constructor(private readonly stockOpnameService: StockOpnameService) {}

  @Post()
  create(@Body() createStockOpnameDto: any) {
    return this.stockOpnameService.create(createStockOpnameDto);
  }

  @Get()
  findAll() {
    return this.stockOpnameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockOpnameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockOpnameDto: UpdateStockOpnameDto) {
    return this.stockOpnameService.update(+id, updateStockOpnameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockOpnameService.remove(+id);
  }
}
