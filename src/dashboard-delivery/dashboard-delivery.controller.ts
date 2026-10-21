import { Controller, Get } from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { DashboardDeliveryService } from './dashboard-delivery.service';

@Controller('dashboard-delivery')
export class DashboardDeliveryController {
  constructor(
    private readonly dashboardDeliveryService: DashboardDeliveryService,
  ) {}

  @Get()
  @Permissions('PACKER.DELIVERY_READ')
  findAll() {
    return this.dashboardDeliveryService.findAll();
  }
}
