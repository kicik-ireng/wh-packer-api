import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateDriverDto) {
    return this.prisma.driver.create({ data });
  }

  findAll() {
    return this.prisma.driver.findMany();
  }

  findOne(id: number) {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateDriverDto) {
    return this.prisma.driver.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.driver.delete({ where: { id } });
  }
}
