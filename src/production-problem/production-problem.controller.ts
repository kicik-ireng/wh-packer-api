import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductionProblemService } from './production-problem.service';
import { CreateProductionProblemDto } from './dto/create-production-problem.dto';
import { UpdateProductionProblemDto } from './dto/update-production-problem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('production-problem')
export class ProductionProblemController {
  constructor(
    private readonly productionProblemService: ProductionProblemService,
  ) {}

  @Post()
  create(@Body() createDto: CreateProductionProblemDto) {
    return this.productionProblemService.create(createDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.productionProblemService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionProblemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductionProblemDto,
  ) {
    return this.productionProblemService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionProblemService.remove(id);
  }
}
