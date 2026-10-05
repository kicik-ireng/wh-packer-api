import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardDeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.deliveryOrder.findMany({
      orderBy: { date: 'desc' },
      include: {
        driver: true,
        customer: true,
        items: {
          include: {
            part2r: true,
            part4r: true,
          },
        },
      },
    });
  }
}
