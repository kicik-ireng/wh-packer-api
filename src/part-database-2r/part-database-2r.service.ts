import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartDatabase2rDto } from './dto/create-part-database-2r.dto';
import { UpdatePartDatabase2rDto } from './dto/update-part-database-2r.dto';

@Injectable()
export class PartDatabase2rService {
  private readonly logger = new Logger(PartDatabase2rService.name);

  constructor(private prisma: PrismaService) {}

  async createMany(data: CreatePartDatabase2rDto[]) {
    try {
      return await this.prisma.partDatabase2r.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error: any) {
      this.logger.error(`Gagal createMany part 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal menyimpan daftar part 2R: ' + error.message);
    }
  }

  async create(dto: CreatePartDatabase2rDto) {
    try {
      return await this.prisma.partDatabase2r.create({ data: dto });
    } catch (error: any) {
      this.logger.error(`Gagal create part 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal menambah part 2R: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.partDatabase2r.findMany();
    } catch (error: any) {
      this.logger.error(`Gagal findAll part 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data part 2R: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const part = await this.prisma.partDatabase2r.findUnique({ where: { id } });
      if (!part) {
        throw new NotFoundException(`Part 2R dengan ID ${id} tidak ditemukan`);
      }
      return part;
    } catch (error: any) {
      this.logger.error(`Gagal findOne part 2R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil detail part 2R: ' + error.message);
    }
  }

  async update(id: number, dto: UpdatePartDatabase2rDto) {
    try {
      const existing = await this.prisma.partDatabase2r.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Part 2R dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.partDatabase2r.update({ where: { id }, data: dto });
    } catch (error: any) {
      this.logger.error(`Gagal update part 2R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal memperbarui part 2R: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.partDatabase2r.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Part 2R dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.partDatabase2r.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Gagal remove part 2R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus part 2R: ' + error.message);
    }
  }
}
