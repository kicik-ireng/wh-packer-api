import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryItemDto } from './dto/create-delivery-item.dto';
import { UpdateDeliveryItemDto } from './dto/update-delivery-item.dto';

@Injectable()
export class DeliveryItemService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDeliveryItemDto) {
    return this.prisma.deliveryItem.create({ data: dto });
  }

  findAll() {
    return this.prisma.deliveryItem.findMany({
      include: {
        part2r: true,
        part4r: true,
        deliveryOrder: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.deliveryItem.findUnique({
      where: { id },
      include: {
        part2r: true,
        part4r: true,
        deliveryOrder: true,
      },
    });
  }

  async update(id: number, dto: UpdateDeliveryItemDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Ambil item lama
      const existingItem = await prisma.deliveryItem.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
        },
      });

      if (!existingItem) throw new Error('Delivery item tidak ditemukan');

      const oldQty = existingItem.qtyDelivered;
      const newQty = dto.qtyDelivered;
      const { part2rId, part4rId } = existingItem;

      // 2. Ambil stok
      const is4R = !!part4rId;
      const stock = await prisma.stock.findFirst({
        where: is4R ? { part4rId } : { part2rId },
      });

      if (!stock) throw new Error('Stock tidak ditemukan');

      if (newQty === undefined) {
        throw new Error('newQty tidak boleh kosong');
      }

      const qtyDiff = newQty - oldQty;
      // const qtyDiff = (newQty ?? 0) - oldQty;

      // 3. Update stok berdasarkan selisih qty
      await prisma.stock.update({
        where: { id: stock.id },
        data: {
          totalStock: {
            decrement: qtyDiff, // jika qty naik -> kurangi stock, jika qty turun -> tambah stock
          },
        },
      });

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
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Ambil delivery item beserta info part-nya
      const item = await prisma.deliveryItem.findUnique({
        where: { id },
        include: {
          part2r: true,
          part4r: true,
        },
      });

      if (!item) throw new Error('Delivery item tidak ditemukan');

      const { qtyDelivered, part2rId, part4rId } = item;

      // 2. Kembalikan stok
      const is4R = !!part4rId;
      const stock = await prisma.stock.findFirst({
        where: is4R ? { part4rId } : { part2rId },
      });

      if (stock) {
        await prisma.stock.update({
          where: { id: stock.id },
          data: {
            totalStock: {
              increment: qtyDelivered,
            },
          },
        });
      }

      // 3. Hapus delivery item
      await prisma.deliveryItem.delete({ where: { id } });

      return {
        message: 'Delivery item berhasil dihapus dan stok dikembalikan',
      };
    });
  }
}
