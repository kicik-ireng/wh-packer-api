import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryItemDto } from './dto/create-delivery-item.dto';
import { UpdateDeliveryItemDto } from './dto/update-delivery-item.dto';

@Injectable()
export class DeliveryItemService {
  private readonly logger = new Logger(DeliveryItemService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDeliveryItemDto) {
    try {
      return await this.prisma.deliveryItem.create({ data: dto });
    } catch (error: any) {
      this.logger.error(`Gagal membuat delivery item: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal membuat delivery item: ' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.deliveryItem.findMany({
        include: {
          part2r: true,
          part4r: true,
          deliveryOrder: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Gagal mengambil data delivery item: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data delivery item: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.prisma.deliveryItem.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
          deliveryOrder: true,
        },
      });
      if (!item) {
        throw new NotFoundException(`Delivery item dengan ID ${id} tidak ditemukan`);
      }
      return item;
    } catch (error: any) {
      this.logger.error(`Gagal mengambil delivery item ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengambil delivery item: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateDeliveryItemDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Ambil item lama
        const existingItem = await prisma.deliveryItem.findUnique({
          where: { id },
          include: {
            part2r: true,
            part4r: true,
            deliveryOrder: true,
          },
        });

        if (!existingItem) {
          throw new NotFoundException('Delivery item tidak ditemukan');
        }

        const oldQty = existingItem.qtyDelivered;
        const newQty = dto.qtyDelivered;
        const { part2rId, part4rId } = existingItem;

        // 2. Ambil stok
        const is4R = !!part4rId;
        const stock = await prisma.stock.findFirst({
          where: is4R ? { part4rId } : { part2rId },
        });

        if (!stock) {
          throw new NotFoundException('Stock tidak ditemukan');
        }

        if (newQty === undefined) {
          throw new BadRequestException('qtyDelivered tidak boleh kosong');
        }

        const qtyDiff = newQty - oldQty;
        const qtyBefore = stock.totalStock;
        const qtyAfter = qtyBefore - qtyDiff;

        if (qtyAfter < 0) {
          throw new BadRequestException(`Stok tidak mencukupi untuk update qty. Stok sekarang: ${qtyBefore}`);
        }

        // 3. Update stok berdasarkan selisih qty
        await prisma.stock.update({
          where: { id: stock.id },
          data: { totalStock: qtyAfter },
        });

        // Record stock transaction jika ada perubahan
        if (qtyDiff !== 0) {
          await prisma.stockTransaction.create({
            data: {
              part2rId: is4R ? null : part2rId,
              part4rId: is4R ? part4rId : null,
              type: qtyDiff > 0 ? 'OUT' : 'IN',
              qtyBefore,
              qtyChange: -qtyDiff,
              qtyAfter,
              pic: 'Admin / Delivery Item Update',
              reference: existingItem.deliveryOrder?.noDo ? `DO-${existingItem.deliveryOrder.noDo}` : `ITEM-#${id}`,
              description: `Perubahan qty delivery item (${oldQty} -> ${newQty})`,
            },
          });
        }

        // 4. Update delivery item
        const updatedItem = await prisma.deliveryItem.update({
          where: { id },
          data: dto,
        });

        return {
          message: 'Delivery item berhasil diperbarui dan stok disesuaikan',
          data: updatedItem,
        };
      });
    } catch (error: any) {
      this.logger.error(`Gagal update delivery item ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Gagal update delivery item: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Ambil delivery item beserta info part-nya
        const item = await prisma.deliveryItem.findUnique({
          where: { id },
          include: {
            part2r: true,
            part4r: true,
            deliveryOrder: true,
          },
        });

        if (!item) {
          throw new NotFoundException('Delivery item tidak ditemukan');
        }

        const { qtyDelivered, part2rId, part4rId } = item;

        // 2. Kembalikan stok
        const is4R = !!part4rId;
        const stock = await prisma.stock.findFirst({
          where: is4R ? { part4rId } : { part2rId },
        });

        if (stock) {
          const qtyBefore = stock.totalStock;
          const qtyAfter = qtyBefore + qtyDelivered;

          await prisma.stock.update({
            where: { id: stock.id },
            data: { totalStock: qtyAfter },
          });

          // Record transaction
          await prisma.stockTransaction.create({
            data: {
              part2rId: is4R ? null : part2rId,
              part4rId: is4R ? part4rId : null,
              type: 'ADJUSTMENT',
              qtyBefore,
              qtyChange: qtyDelivered,
              qtyAfter,
              pic: 'Admin / Cancel Item',
              reference: item.deliveryOrder?.noDo ? `CANCEL-ITEM-DO-${item.deliveryOrder.noDo}` : `ITEM-#${id}`,
              description: `Pengembalian stok dari penghapusan delivery item`,
            },
          });
        }

        // 3. Hapus delivery item
        await prisma.deliveryItem.delete({ where: { id } });

        return {
          message: 'Delivery item berhasil dihapus dan stok dikembalikan',
        };
      });
    } catch (error: any) {
      this.logger.error(`Gagal menghapus delivery item ID ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal menghapus delivery item: ' + error.message);
    }
  }
}
