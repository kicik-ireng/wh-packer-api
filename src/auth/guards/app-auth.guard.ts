import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]) ||
      this.reflector.getAllAndOverride<boolean>('vuteq:public', [
        context.getHandler(),
        context.getClass(),
      ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const path = (request.path || request.url || '').toLowerCase();

    // Allow profile and logout callbacks so authenticated session and status can be inspected
    if (
      path.includes('/auth/profile') ||
      path.includes('/auth/backchannel-logout')
    ) {
      return true;
    }

    const auth = request.auth;
    if (!auth || !auth.user) {
      // Missing or invalid token will be handled by VuteqSsoGuard
      return true;
    }

    const globalRoles = Array.isArray(auth.user.globalRoles)
      ? auth.user.globalRoles
      : [];
    const isSuper =
      globalRoles.some((r: string) => {
        const upper = (r || '').toUpperCase();
        return (
          upper === 'GLOBAL_ADMINISTRATOR' ||
          upper === 'SUPER_ADMINISTRATOR' ||
          upper === 'GLOBAL_ADMIN' ||
          upper === 'ADMIN'
        );
      }) || auth.user.roles?.includes('admin');

    if (isSuper) {
      return true;
    }

    const roleName =
      (auth.user.roles?.[0] as string) ||
      (auth.user.attributes?.RoleName as string) ||
      'none';
    const accessStatus = auth.user.attributes?.accessStatus as string;

    if (roleName.toLowerCase() === 'none' || accessStatus === 'PENDING') {
      throw new ForbiddenException(
        'Akses ditolak: Akun Anda memiliki Role None. Silakan hubungi Administrator untuk mendapatkan hak akses.',
      );
    }

    if (accessStatus === 'BLOCKED') {
      throw new ForbiddenException('Akses ditolak: Akun Anda telah dinonaktifkan.');
    }

    return true;
  }
}
