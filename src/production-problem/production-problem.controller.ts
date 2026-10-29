import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { ProductionProblemService } from './production-problem.service';
import { CreateProductionProblemDto } from './dto/create-production-problem.dto';
import { UpdateProductionProblemDto } from './dto/update-production-problem.dto';

@Controller('production-problem')
export class ProductionProblemController {
  constructor(
    private readonly productionProblemService: ProductionProblemService,
  ) {}

  @Public()
  @Post()
  create(@Body() createDto: CreateProductionProblemDto) {
    return this.productionProblemService.create(createDto);
  }

  @Public()
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.productionProblemService.findAll(pageNum, limitNum);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionProblemService.findOne(id);
  }

  @Patch(':id')
  @Permissions('PACKER.PRODUCTION_PROBLEM_UPDATE')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductionProblemDto,
  ) {
    return this.productionProblemService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('PACKER.PRODUCTION_PROBLEM_DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productionProblemService.remove(id);
  }
}
