import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockOpnameDto } from './dto/create-stock-opname.dto';
import { UpdateStockOpnameDto } from './dto/update-stock-opname.dto';

@Injectable()
export class StockOpnameService {
  constructor(private prisma: PrismaService) {}

  async create(createStockOpnameDto: CreateStockOpnameDto | CreateStockOpnameDto[]) {
    try {
      if (Array.isArray(createStockOpnameDto)) {
        const data = createStockOpnameDto.map((dto) => ({
          part2rId: dto.part2rId,
          part4rId: dto.part4rId,
          qtySystem: dto.qtySystem,
          qtyActual: dto.qtyActual,
          keterangan: dto.keterangan,
          pic: dto.pic,
          status: dto.status || 'PENDING',
        }));
        return await this.prisma.stockOpname.createMany({ data });
      } else {
        return await this.prisma.stockOpname.create({
          data: {
            part2rId: createStockOpnameDto.part2rId,
            part4rId: createStockOpnameDto.part4rId,
            qtySystem: createStockOpnameDto.qtySystem,
            qtyActual: createStockOpnameDto.qtyActual,
            keterangan: createStockOpnameDto.keterangan,
            pic: createStockOpnameDto.pic,
            status: createStockOpnameDto.status || 'PENDING',
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Gagal membuat stock opname', error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.stockOpname.findMany({
        include: {
          part2r: true,
          part4r: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil data stock opname', error.message);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.stockOpname.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil data stock opname', error.message);
    }
  }

  async update(id: number, updateStockOpnameDto: UpdateStockOpnameDto) {
    try {
      return await this.prisma.stockOpname.update({
        where: { id },
        data: {
          ...updateStockOpnameDto,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Gagal update data stock opname', error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.stockOpname.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus data stock opname', error.message);
    }
  }
}
