import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CurrentUser, Permissions, type VuteqUser } from '@vuteq/sso-client-nest';
import { actorContext } from '../common/actor';
import type { RequestWithContext } from '../common/api.types';
import { AdminQueryDto, AssignRoleDto, RoleBodyDto } from './admin.dto';
import { AdminService } from './admin.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @Permissions('PACKER.USER_MANAGEMENT')
  list(@Query() query: AdminQueryDto) {
    return this.service.users(query);
  }

  @Patch(':id/authorization')
  @Permissions('PACKER.USER_MANAGEMENT')
  update(
    @Param('id') id: string,
    @Body() body: AssignRoleDto,
    @Req() request: RequestWithContext,
    @CurrentUser() user: VuteqUser,
  ) {
    return this.service.assignRole(id, body, actorContext(request, user));
  }

  @Delete(':id')
  @Permissions('PACKER.USER_MANAGEMENT')
  delete(
    @Param('id') id: string,
    @Req() request: RequestWithContext,
    @CurrentUser() user: VuteqUser,
  ) {
    return this.service.deleteUser(id, actorContext(request, user));
  }
}

@Controller('roles')
export class RolesController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @Permissions('PACKER.ROLE_MANAGEMENT')
  list(@Query() query: AdminQueryDto) {
    return this.service.roles(query);
  }

  @Post()
  @Permissions('PACKER.ROLE_MANAGEMENT')
  create(
    @Body() body: RoleBodyDto,
    @Req() request: RequestWithContext,
    @CurrentUser() user: VuteqUser,
  ) {
    return this.service.saveRole(null, body, actorContext(request, user));
  }

  @Patch(':id')
  @Permissions('PACKER.ROLE_MANAGEMENT')
  update(
    @Param('id') id: string,
    @Body() body: RoleBodyDto,
    @Req() request: RequestWithContext,
    @CurrentUser() user: VuteqUser,
  ) {
    return this.service.saveRole(Number(id), body, actorContext(request, user));
  }
}

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @Permissions('PACKER.ROLE_MANAGEMENT')
  list(@Query() query: AdminQueryDto) {
    return this.service.permissions(query);
  }
}
