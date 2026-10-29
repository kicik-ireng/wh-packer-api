import { Controller, Get } from '@nestjs/common';
import { Permissions, Public } from '@vuteq/sso-client-nest';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }
}
