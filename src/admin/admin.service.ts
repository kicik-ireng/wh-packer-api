import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { ActorContext } from '../common/api.types';
import { pageMeta } from '../common/pagination.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { AdminQueryDto, AssignRoleDto, RoleBodyDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async users(query: AdminQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 15;
    const where: any = {
      ...(query.IsActive !== undefined ? { IsActive: query.IsActive } : {}),
      ...(query.Name ? { Name: { contains: query.Name } } : {}),
      ...(query.UserName ? { UserName: { contains: query.UserName } } : {}),
      ...(query.RoleName ? { Role: { RoleName: query.RoleName } } : {}),
      ...(query.search
        ? {
            OR: [
              { Name: { contains: query.search } },
              { UserName: { contains: query.search } },
              { Email: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.appUser.findMany({
        where,
        include: { Role: { include: { Permissions: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { Name: 'asc' },
      }),
      this.prisma.appUser.count({ where }),
    ]);

    return { data, meta: pageMeta(page, limit, totalItems) };
  }

  async assignRole(id: string, body: AssignRoleDto, actor: ActorContext) {
    const before = await this.prisma.appUser.findUnique({
      where: { Id: id },
      include: { Role: true },
    });
    if (!before) throw new NotFoundException('User not found');

    const updateData: any = {
      UpdatedBy: actor.Actor,
    };
    if (body.RoleId !== undefined) updateData.RoleId = body.RoleId;
    if (body.IsActive !== undefined) updateData.IsActive = body.IsActive;

    const data = await this.prisma.appUser.update({
      where: { Id: id },
      data: updateData,
      include: { Role: { include: { Permissions: true } } },
    });

    return { data, message: 'User authorization updated successfully' };
  }

  async deleteUser(id: string, actor: ActorContext) {
    const before = await this.prisma.appUser.findUnique({
      where: { Id: id },
      include: { Role: true },
    });
    if (!before) throw new NotFoundException('User not found');
    if (before.SsoObjectId === actor.Actor) {
      throw new ConflictException('You cannot delete your own user account');
    }

    await this.prisma.appUser.delete({ where: { Id: id } });
    return { data: { id }, message: 'User deleted successfully' };
  }

  async roles(query: AdminQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 15;
    const where: any = {
      ...(query.IsActive !== undefined ? { IsActive: query.IsActive } : {}),
      ...(query.search
        ? {
            OR: [
              { RoleName: { contains: query.search } },
              { Description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.role.findMany({
        where,
        include: {
          Permissions: true,
          _count: { select: { Users: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { RoleName: 'asc' },
      }),
      this.prisma.role.count({ where }),
    ]);

    return { data, meta: pageMeta(page, limit, totalItems) };
  }

  async saveRole(id: number | null, body: RoleBodyDto, actor: ActorContext) {
    const before = id
      ? await this.prisma.role.findUnique({
          where: { Id: id },
          include: { Permissions: true },
        })
      : null;
    if (id && !before) throw new NotFoundException('Role not found');

    const permissions = await this.prisma.permission.findMany({
      where: { Action: { in: body.PermissionActions } },
      select: { Id: true },
    });

    const data = id
      ? await this.prisma.role.update({
          where: { Id: id },
          data: {
            RoleName: body.RoleName,
            Description: body.Description,
            IsActive: body.IsActive !== undefined ? body.IsActive : true,
            UpdatedBy: actor.Actor,
            Permissions: { set: permissions.map(({ Id }) => ({ Id })) },
          },
          include: { Permissions: true },
        })
      : await this.prisma.role.create({
          data: {
            RoleName: body.RoleName,
            Description: body.Description,
            IsActive: body.IsActive !== undefined ? body.IsActive : true,
            CreatedBy: actor.Actor,
            UpdatedBy: actor.Actor,
            Permissions: { connect: permissions.map(({ Id }) => ({ Id })) },
          },
          include: { Permissions: true },
        });

    return { data, message: 'Role saved successfully' };
  }

  async permissions(query: AdminQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const where: any = {
      ...(query.Action ? { Action: { contains: query.Action } } : {}),
      ...(query.search
        ? {
            OR: [
              { Action: { contains: query.search } },
              { Description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { Action: 'asc' },
      }),
      this.prisma.permission.count({ where }),
    ]);

    return { data, meta: pageMeta(page, limit, totalItems) };
  }
}
