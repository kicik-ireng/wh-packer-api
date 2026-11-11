import { Controller, Get } from '@nestjs/common';
import { DashboardAdminService } from './dashboard-admin.service';

@Controller('dashboard-admin')
export class DashboardAdminController {
  constructor(private readonly dashboardAdminService: DashboardAdminService) {}

  @Get()
  getDashboard() {
    return this.dashboardAdminService.getAdminDashboard();
  }
}

