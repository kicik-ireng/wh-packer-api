import { Controller, Get } from '@nestjs/common';
import { DashboardDeliveryService } from './dashboard-delivery.service';

@Controller('dashboard-delivery')
export class DashboardDeliveryController {
  constructor(
    private readonly dashboardDeliveryService: DashboardDeliveryService,
  ) {}

  @Get()
  findAll() {
    return this.dashboardDeliveryService.findAll();
  }
}
