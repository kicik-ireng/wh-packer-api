import { Controller, Get, Res, ForbiddenException } from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { Permissions, CurrentUser, type VuteqUser } from '@vuteq/sso-client-nest';
import type { Response } from 'express';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  @Get('export/all')
  @Permissions('PACKER.USER_MANAGEMENT')
  async exportAllMasterData(
    @Res() res: Response,
    @CurrentUser() user: VuteqUser,
  ) {
    const isSuperAdmin =
      (user?.globalRoles ?? []).some((r: string) => {
        const upper = (r || '').toUpperCase();
        return (
          upper === 'GLOBAL_ADMINISTRATOR' ||
          upper === 'SUPER_ADMINISTRATOR' ||
          upper === 'GLOBAL_ADMIN' ||
          upper === 'ADMIN'
        );
      }) ||
      (user?.roles ?? []).includes('admin') ||
      (user?.roles ?? []).includes('Super Admin') ||
      (user?.permissions ?? []).includes('PACKER.USER_MANAGEMENT');

    if (!isSuperAdmin) {
      throw new ForbiddenException(
        'Akses ditolak: Hanya Super Administrator yang berhak mengunduh seluruh master data sistem.',
      );
    }

    return this.service.exportAllMasterDataToExcel(res, user);
  }
}
