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

      // Ensure 'none' role exists with NO permissions (waiting for admin approval)
      const noneRole = await this.prisma.role.findUnique({
        where: { RoleName: 'none' },
        include: { Permissions: true },
      });
      if (!noneRole) {
        await this.prisma.role.create({
          data: {
            RoleName: 'none',
            Description: 'Default role for unassigned SSO users pending admin approval',
            IsActive: true,
            CreatedBy: 'System',
            UpdatedBy: 'System',
          },
        });
      } else if (noneRole.Permissions.length > 0) {
        // Enforce that role 'none' has zero permissions
        await this.prisma.role.update({
          where: { Id: noneRole.Id },
          data: {
            Permissions: { set: [] },
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
      globalRoles.some((r: string) => {
        const upper = (r || '').toUpperCase();
        return (
          upper === 'GLOBAL_ADMINISTRATOR' ||
          upper === 'SUPER_ADMINISTRATOR' ||
          upper === 'GLOBAL_ADMIN' ||
          upper === 'ADMIN'
        );
      }) ||
      (process.env.BOOTSTRAP_ADMIN_EMAIL &&
        email &&
        process.env.BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase() === email);

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

    // 2. Safe Fallback: lookup by Email if not found by SsoObjectId
    if (!user && email) {
      const byEmail = await this.prisma.appUser.findUnique({
        where: { Email: email },
        include: { Role: { include: { Permissions: true } } },
      });
      if (byEmail && (!byEmail.SsoObjectId || byEmail.SsoObjectId === identity.id)) {
        user = byEmail;
      }
    }

    if (isGlobalAdmin) {
      // User with SSO Global Admin -> automatically assign/promote to admin role
      if (user) {
        user = await this.prisma.appUser.update({
          where: { Id: user.Id },
          data: {
            SsoObjectId: identity.id,
            UserName: username,
            Name: name,
            Email: email,
            RoleId: adminRole?.Id,
            IsActive: true,
            LastLogin: new Date(),
            UpdatedBy: actor,
          },
          include: { Role: { include: { Permissions: true } } },
        });
      } else {
        user = await this.prisma.appUser.create({
          data: {
            SsoObjectId: identity.id,
            UserName: username,
            Name: name,
            Email: email,
            RoleId: adminRole?.Id,
            IsActive: true,
            LastLogin: new Date(),
            CreatedBy: actor,
            UpdatedBy: actor,
          },
          include: { Role: { include: { Permissions: true } } },
        });
      }

      return {
        roles: ['admin'],
        permissions: [...PACKER_PERMISSIONS],
        attributes: {
          localUserId: user.Id,
          accessStatus: 'ACTIVE',
          RoleName: 'admin',
        },
      };
    }

    // Regular SSO user (not Global Admin)
    if (user) {
      // Existing user: preserve configured role, update profile info
      user = await this.prisma.appUser.update({
        where: { Id: user.Id },
        data: {
          SsoObjectId: identity.id,
          UserName: username,
          Name: name,
          Email: email,
          LastLogin: new Date(),
          UpdatedBy: actor,
        },
        include: { Role: { include: { Permissions: true } } },
      });
    } else {
      // Brand new user from SSO -> automatically create with role 'none'
      // This ensures their data appears in User Management for the admin to configure
      user = await this.prisma.appUser.create({
        data: {
          SsoObjectId: identity.id,
          UserName: username,
          Name: name,
          Email: email,
          RoleId: noneRole?.Id,
          IsActive: true,
          LastLogin: new Date(),
          CreatedBy: actor,
          UpdatedBy: actor,
        },
        include: { Role: { include: { Permissions: true } } },
      });
    }

    const currentRoleName = user.Role?.RoleName ?? 'none';
    const isNoneRole =
      currentRoleName.toLowerCase() === 'none' ||
      !user.RoleId ||
      (user.Role?.Permissions?.length ?? 0) === 0;

    if (!user.IsActive) {
      return {
        roles: [],
        permissions: [],
        attributes: {
          localUserId: user.Id,
          accessStatus: 'BLOCKED',
          RoleName: currentRoleName,
        },
      };
    }

    if (isNoneRole) {
      return {
        roles: ['none'],
        permissions: [],
        attributes: {
          localUserId: user.Id,
          accessStatus: 'PENDING',
          RoleName: 'none',
        },
      };
    }

    // User has an active role configured by admin
    const effectiveRoleName = user.Role?.RoleName ?? 'none';
    const effectivePermissions =
      user.Role?.Permissions.map((p) => p.Action) ?? [];

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
      (user.globalRoles ?? []).some((r: string) => {
        const upper = (r || '').toUpperCase();
        return (
          upper === 'GLOBAL_ADMINISTRATOR' ||
          upper === 'SUPER_ADMINISTRATOR' ||
          upper === 'GLOBAL_ADMIN' ||
          upper === 'ADMIN'
        );
      }) || (user.roles ?? []).includes('admin');

    if (isGlobalAdmin) {
      return {
        Id: user.id,
        Name: user.name ?? local?.Name ?? 'Vuteq User',
        UserName: user.username ?? local?.UserName,
        Email: user.email ?? local?.Email,
        EmailVerified: user.emailVerified,
        GlobalRoles: user.globalRoles,
        LocalRole: 'admin',
        RoleName: 'admin',
        Permissions: [...PACKER_PERMISSIONS],
        IsActive: true,
        AccessStatus: 'ACTIVE',
      };
    }

    const roleName = local?.Role?.RoleName ?? 'none';
    const isNoneRole =
      roleName.toLowerCase() === 'none' ||
      !local?.RoleId ||
      (local?.Role?.Permissions?.length ?? 0) === 0;

    const isActive = local ? local.IsActive : true;
    let accessStatus = 'ACTIVE';
    if (!isActive) {
      accessStatus = 'BLOCKED';
    } else if (isNoneRole) {
      accessStatus = 'PENDING';
    }

    const permissions = isNoneRole
      ? []
      : (local?.Role?.Permissions?.map((p) => p.Action) ?? user.permissions ?? []);

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

