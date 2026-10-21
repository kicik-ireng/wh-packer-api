import { Controller, Get } from '@nestjs/common';
import { Permissions } from '@vuteq/sso-client-nest';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Permissions('PACKER.DASHBOARD_READ')
  findAll() {
    return this.dashboardService.findAll();
  }
}
