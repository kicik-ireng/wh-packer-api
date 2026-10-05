import { Module } from '@nestjs/common';
import { StockOpnameService } from './stock-opname.service';
import { StockOpnameController } from './stock-opname.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StockOpnameController],
  providers: [StockOpnameService],
})
export class StockOpnameModule {}
