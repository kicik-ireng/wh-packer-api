import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Permissions('PACKER.CUSTOMER_CREATE')
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Put(':id')
  @Permissions('PACKER.CUSTOMER_UPDATE')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(+id, dto);
  }

  @Patch(':id')
  @Permissions('PACKER.CUSTOMER_UPDATE')
  patch(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('PACKER.CUSTOMER_DELETE')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
