import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@Injectable()
export class TruckService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTruckDto) {
    return this.prisma.truck.create({ data: dto });
  }

  findAll() {
    return this.prisma.truck.findMany();
  }

  findOne(id: number) {
    return this.prisma.truck.findUnique({
      where: { id },
      include: { scheduleTruck: true },
    });
  }

  update(id: number, dto: UpdateTruckDto) {
    return this.prisma.truck.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.truck.delete({ where: { id } });
  }
}
