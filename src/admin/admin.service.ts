import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import type { ActorContext } from '../common/api.types';
import { pageMeta } from '../common/pagination.dto';
import { PrismaService } from '../../prisma/prisma.service';
import type { AdminQueryDto, AssignRoleDto, RoleBodyDto } from './admin.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async users(query: AdminQueryDto) {
    try {
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
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching users:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data user');
    }
  }

  async assignRole(id: string, body: AssignRoleDto, actor: ActorContext) {
    try {
      const before = await this.prisma.appUser.findUnique({
        where: { Id: id },
        include: { Role: true },
      });
      if (!before) throw new NotFoundException('User tidak ditemukan');

      const updateData: any = {
        UpdatedBy: actor.Actor,
      };

      let targetRoleId = body.RoleId ?? body.roleId;
      const targetRoleName = body.RoleName ?? body.roleName;

      if (targetRoleName) {
        const foundRole = await this.prisma.role.findFirst({
          where: {
            RoleName: { equals: targetRoleName },
          },
        });
        if (foundRole) {
          targetRoleId = foundRole.Id;
        } else {
          throw new NotFoundException(`Role "${targetRoleName}" tidak ditemukan`);
        }
      }

      if (targetRoleId !== undefined) updateData.RoleId = targetRoleId;
      if (body.IsActive !== undefined) updateData.IsActive = body.IsActive;
      if (body.isActive !== undefined) updateData.IsActive = body.isActive;

      const data = await this.prisma.appUser.update({
        where: { Id: id },
        data: updateData,
        include: { Role: { include: { Permissions: true } } },
      });

      return { data, message: 'Otorisasi user berhasil diperbarui' };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error updating user authorization ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal memperbarui otorisasi user');
    }
  }

  async deleteUser(id: string, actor: ActorContext) {
    try {
      const before = await this.prisma.appUser.findUnique({
        where: { Id: id },
        include: { Role: true },
      });
      if (!before) throw new NotFoundException('User tidak ditemukan');
      if (before.SsoObjectId === actor.Actor) {
        throw new ConflictException('Anda tidak dapat menghapus akun Anda sendiri');
      }

      await this.prisma.appUser.delete({ where: { Id: id } });
      return { data: { id }, message: 'User berhasil dihapus' };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error deleting user ${id}:`, error);
      throw new InternalServerErrorException(error?.message || 'Gagal menghapus user');
    }
  }

  async roles(query: AdminQueryDto) {
    try {
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
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching roles:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data role');
    }
  }

  async saveRole(id: number | null, body: RoleBodyDto, actor: ActorContext) {
    try {
      const before = id
        ? await this.prisma.role.findUnique({
            where: { Id: id },
            include: { Permissions: true },
          })
        : null;
      if (id && !before) throw new NotFoundException('Role tidak ditemukan');

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

      return { data, message: 'Role berhasil disimpan' };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error saving role:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal menyimpan role');
    }
  }

  async permissions(query: AdminQueryDto) {
    try {
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
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error fetching permissions:', error);
      throw new InternalServerErrorException(error?.message || 'Gagal mengambil data permission');
    }
  }
}
