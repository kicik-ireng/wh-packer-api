import { Injectable, Logger } from '@nestjs/common';
import type {
  VuteqAccessClaims,
  VuteqIdentity,
  VuteqLocalAuthorization,
  VuteqUser,
} from '@vuteq/sso-client-nest';
import { PrismaService } from '../../prisma/prisma.service';
import { PACKER_PERMISSIONS } from '../common/permissions.constant';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaultRolesAndPermissions() {
    try {
      // Ensure all permissions exist in the database
      for (const action of PACKER_PERMISSIONS) {
        await this.prisma.permission.upsert({
          where: { Action: action },
          update: {},
          create: {
            Action: action,
            Description: action.replace('PACKER.', '').replace(/_/g, ' '),
            CreatedBy: 'System',
            UpdatedBy: 'System',
          },
        });
      }

      const allPermissions = await this.prisma.permission.findMany({
        where: { Action: { in: [...PACKER_PERMISSIONS] } },
        select: { Id: true },
      });

      // Ensure 'admin' role exists with ALL permissions
      await this.prisma.role.upsert({
        where: { RoleName: 'admin' },
        update: {
          IsActive: true,
          Permissions: {
            set: allPermissions.map((p) => ({ Id: p.Id })),
          },
        },
        create: {
          RoleName: 'admin',
          Description: 'Administrator with full system privileges',
          IsActive: true,
          CreatedBy: 'System',
          UpdatedBy: 'System',
          Permissions: {
            connect: allPermissions.map((p) => ({ Id: p.Id })),
          },
        },
      });

      // Ensure 'none' role exists as default standard role
      const noneRole = await this.prisma.role.findUnique({
        where: { RoleName: 'none' },
      });
      if (!noneRole) {
        await this.prisma.role.create({
          data: {
            RoleName: 'none',
            Description: 'Standard default role with permissions assigned by administrator',
            IsActive: true,
            CreatedBy: 'System',
            UpdatedBy: 'System',
          },
        });
      }
    } catch (error) {
      this.logger.error('Failed to ensure default roles and permissions:', error);
    }
  }

  async resolve(
    identity: VuteqIdentity,
    claims: VuteqAccessClaims,
  ): Promise<VuteqLocalAuthorization> {
    await this.ensureDefaultRolesAndPermissions();

    const actor = identity.id;
    const email = identity.email ? identity.email.trim().toLowerCase() : null;
    const username = identity.username ?? identity.email ?? identity.id;
    const name = identity.name ?? identity.username ?? 'Vuteq User';
    const globalRoles = Array.isArray(claims?.roles) ? claims.roles : [];

    // Global Administrator from SSO automatically gets 'admin' role
    const isGlobalAdmin =
      globalRoles.includes('GLOBAL_ADMINISTRATOR') ||
      globalRoles.includes('SUPER_ADMINISTRATOR') ||
      globalRoles.includes('admin');

    const adminRole = await this.prisma.role.findUnique({
      where: { RoleName: 'admin' },
      include: { Permissions: true },
    });
    const noneRole = await this.prisma.role.findUnique({
      where: { RoleName: 'none' },
      include: { Permissions: true },
    });

    // 1. Primary lookup by immutable SSO Subject
    let user = await this.prisma.appUser.findUnique({
      where: { SsoObjectId: identity.id },
      include: { Role: { include: { Permissions: true } } },
    });

    // 2. Safe Fallback: if not found by SsoObjectId, check by Email
    if (!user && email) {
      const byEmail = await this.prisma.appUser.findUnique({
        where: { Email: email },
        include: { Role: { include: { Permissions: true } } },
      });
      if (byEmail && (!byEmail.SsoObjectId || byEmail.SsoObjectId === identity.id)) {
        user = byEmail;
      }
    }

    if (user) {
      // If user is global admin, enforce 'admin' role
      const roleIdToSet = isGlobalAdmin
        ? adminRole?.Id
        : user.RoleId ?? noneRole?.Id;

      user = await this.prisma.appUser.update({
        where: { Id: user.Id },
        data: {
          SsoObjectId: identity.id,
          UserName: username,
          Name: name,
          Email: email,
          RoleId: roleIdToSet,
          LastLogin: new Date(),
          UpdatedBy: actor,
        },
        include: { Role: { include: { Permissions: true } } },
      });
    } else {
      // 3. Auto-provision new user: Global Administrator -> admin, else -> none
      const initialRoleId = isGlobalAdmin ? adminRole?.Id : noneRole?.Id;
      user = await this.prisma.appUser.create({
        data: {
          SsoObjectId: identity.id,
          UserName: username,
          Name: name,
          Email: email,
          RoleId: initialRoleId,
          IsActive: true,
          LastLogin: new Date(),
          CreatedBy: actor,
          UpdatedBy: actor,
        },
        include: { Role: { include: { Permissions: true } } },
      });
    }

    if (!user.IsActive) {
      return {
        roles: [],
        permissions: [],
        attributes: {
          localUserId: user.Id,
          accessStatus: 'BLOCKED',
        },
      };
    }

    const effectiveRoleName = isGlobalAdmin ? 'admin' : (user.Role?.RoleName ?? 'none');
    const effectivePermissions = isGlobalAdmin
      ? [...PACKER_PERMISSIONS]
      : (user.Role?.Permissions.map((p) => p.Action) ?? []);

    return {
      roles: [effectiveRoleName],
      permissions: effectivePermissions,
      attributes: {
        localUserId: user.Id,
        accessStatus: 'ACTIVE',
        RoleName: effectiveRoleName,
      },
    };
  }

  async profile(user: VuteqUser) {
    const local = await this.prisma.appUser.findUnique({
      where: { SsoObjectId: user.id },
      include: { Role: { include: { Permissions: true } } },
    });

    const isGlobalAdmin =
      (user.globalRoles ?? []).includes('GLOBAL_ADMINISTRATOR') ||
      (user.globalRoles ?? []).includes('SUPER_ADMINISTRATOR') ||
      (user.roles ?? []).includes('admin');

    const roleName = isGlobalAdmin
      ? 'admin'
      : (local?.Role?.RoleName ?? 'none');

    const permissions = isGlobalAdmin
      ? [...PACKER_PERMISSIONS]
      : (local?.Role?.Permissions?.map((p) => p.Action) ?? user.permissions ?? []);

    const isActive = local ? local.IsActive : true;
    const accessStatus = !isActive ? 'BLOCKED' : 'ACTIVE';

    return {
      Id: user.id,
      Name: user.name ?? local?.Name ?? 'Vuteq User',
      UserName: user.username ?? local?.UserName,
      Email: user.email ?? local?.Email,
      EmailVerified: user.emailVerified,
      GlobalRoles: user.globalRoles,
      LocalRole: roleName,
      RoleName: roleName,
      Permissions: permissions,
      IsActive: isActive,
      AccessStatus: accessStatus,
    };
  }
}
