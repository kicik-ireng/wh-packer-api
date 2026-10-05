// part-database-4r.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartDatabase4rDto } from './dto/create-part-database-4r.dto';
import { UpdatePartDatabase4rDto } from './dto/update-part-database-4r.dto';

@Injectable()
export class PartDatabase4rService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePartDatabase4rDto) {
    return this.prisma.partDatabase4r.create({ data: dto });
  }

  createMany(data: CreatePartDatabase4rDto[]) {
    return this.prisma.partDatabase4r.createMany({
      data,
      skipDuplicates: true, // supaya tidak error kalau assyNo16 sudah ada
    });
  }

  findAll() {
    return this.prisma.partDatabase4r.findMany();
  }

  findOne(id: number) {
    return this.prisma.partDatabase4r.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdatePartDatabase4rDto) {
    return this.prisma.partDatabase4r.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.partDatabase4r.delete({ where: { id } });
  }
}
