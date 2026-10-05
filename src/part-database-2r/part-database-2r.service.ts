// part-database-2r.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartDatabase2rDto } from './dto/create-part-database-2r.dto';
import { UpdatePartDatabase2rDto } from './dto/update-part-database-2r.dto';

@Injectable()
export class PartDatabase2rService {
  constructor(private prisma: PrismaService) {}

  createMany(data: CreatePartDatabase2rDto[]) {
    return this.prisma.partDatabase2r.createMany({
      data,
      skipDuplicates: true, // supaya tidak error kalau assyNo16 sudah ada
    });
  }

  create(dto: CreatePartDatabase2rDto) {
    return this.prisma.partDatabase2r.create({ data: dto });
  }

  findAll() {
    return this.prisma.partDatabase2r.findMany();
  }

  findOne(id: number) {
    return this.prisma.partDatabase2r.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdatePartDatabase2rDto) {
    return this.prisma.partDatabase2r.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.partDatabase2r.delete({ where: { id } });
  }
}
