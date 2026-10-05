import { Controller, Get } from '@nestjs/common';
import { PicRekapService } from './pic-rekap.service';

@Controller('pic-rekap')
export class PicRekapController {
  constructor(private readonly service: PicRekapService) {}

  @Get('daily')
  async getDailyRekap() {
    const data = await this.service.getDailyRekap();
    // Format output

    //   name,
    //   total,
    // }));

    return await this.service.getDailyRekap();
  }
}
