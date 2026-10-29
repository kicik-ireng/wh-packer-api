import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardDeliveryService {
  private readonly logger = new Logger(DashboardDeliveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.deliveryOrder.findMany({
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
    } catch (error: any) {
      this.logger.error(`Error in DashboardDelivery findAll: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil data dashboard delivery: ' + error.message);
    }
  }
}
