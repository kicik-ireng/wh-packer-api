import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ManpowerModule } from './manpower/manpower.module';
import { PackingReportModule } from './packing-report/packing-report.module';
import { ProductionProblemModule } from './production-problem/production-problem.module';
import { PrismaService } from '../prisma/prisma.service';
import { PackingEntryModule } from './packing-entry/packing-entry.module';
import { Incoming2rModule } from './incoming2r/incoming2r.module';
import { Incoming4rModule } from './incoming4r/incoming4r.module';
import { PartDatabase2rModule } from './part-database-2r/part-database-2r.module';
import { PartDatabase4rModule } from './part-database-4r/part-database-4r.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StockModule } from './stock/stock.module';
import { DriverModule } from './driver/driver.module';
import { DeliveryItemModule } from './delivery-item/delivery-item.module';
import { DeliveryOrderModule } from './delivery-order/delivery-order.module';
import { CustomerModule } from './customer/customer.module';
import { DashboardDeliveryModule } from './dashboard-delivery/dashboard-delivery.module';
import { TruckModule } from './truck/truck.module';
import { ScheduleTruckModule } from './schedule-truck/schedule-truck.module';
import { ScheduleCustomerModule } from './schedule-customer/schedule-customer.module';
import { ScheduleModule } from '@nestjs/schedule';

import { MonthlyRekapModule } from './monthly/monthly-rekap.module';
import { StockOpnameModule } from './stock-opname/stock-opname.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    AdminModule,
    ManpowerModule,
    PackingReportModule,
    PackingEntryModule,
    ProductionProblemModule,
    Incoming2rModule,
    Incoming4rModule,
    PartDatabase2rModule,
    PartDatabase4rModule,
    DashboardModule,
    StockModule,
    DriverModule,
    DeliveryItemModule,
    DeliveryOrderModule,
    CustomerModule,
    DashboardDeliveryModule,
    TruckModule,
    ScheduleTruckModule,
    ScheduleCustomerModule,
    MonthlyRekapModule,
    StockOpnameModule,
  ],
  controllers: [AppController],
  // providers: [AppService,TaskService],
  providers: [AppService],
})
export class AppModule {}
