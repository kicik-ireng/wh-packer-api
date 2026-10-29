import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartDatabase4rDto } from './dto/create-part-database-4r.dto';
import { UpdatePartDatabase4rDto } from './dto/update-part-database-4r.dto';

@Injectable()
export class PartDatabase4rService {
  private readonly logger = new Logger(PartDatabase4rService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePartDatabase4rDto) {
    try {
      return await this.prisma.partDatabase4r.create({ data: dto });
    } catch (error: any) {
      this.logger.error(`Gagal create part 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal menambah part 4R: ' + error.message);
    }
  }

  async createMany(data: CreatePartDatabase4rDto[]) {
    try {
      return await this.prisma.partDatabase4r.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error: any) {
      this.logger.error(`Gagal createMany part 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal menyimpan daftar part 4R: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.partDatabase4r.findMany();
    } catch (error: any) {
      this.logger.error(`Gagal findAll part 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data part 4R: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const part = await this.prisma.partDatabase4r.findUnique({ where: { id } });
      if (!part) {
        throw new NotFoundException(`Part 4R dengan ID ${id} tidak ditemukan`);
      }
      return part;
    } catch (error: any) {
      this.logger.error(`Gagal findOne part 4R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil detail part 4R: ' + error.message);
    }
  }

  async update(id: number, dto: UpdatePartDatabase4rDto) {
    try {
      const existing = await this.prisma.partDatabase4r.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Part 4R dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.partDatabase4r.update({ where: { id }, data: dto });
    } catch (error: any) {
      this.logger.error(`Gagal update part 4R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal memperbarui part 4R: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.prisma.partDatabase4r.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Part 4R dengan ID ${id} tidak ditemukan`);
      }
      return await this.prisma.partDatabase4r.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(`Gagal remove part 4R ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus part 4R: ' + error.message);
    }
  }
}
