import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Injectable()
export class ManpowerService {
  constructor(private prisma: PrismaService) {}

  async create(createManpowerDto: CreateManpowerDto) {
    return this.prisma.manpower.create({
      data: createManpowerDto,
    });
  }

  async findAll() {
    return this.prisma.manpower.findMany();
  }

  async findOne(id: number) {
    const manpower = await this.prisma.manpower.findUnique({ where: { id } });
    if (!manpower) throw new NotFoundException('Manpower not found');
    return manpower;
  }

  async update(id: number, updateManpowerDto: UpdateManpowerDto) {
    return this.prisma.manpower.update({
      where: { id },
      data: updateManpowerDto,
    });
  }

  async remove(id: number) {
    return this.prisma.manpower.delete({ where: { id } });
  }
}
