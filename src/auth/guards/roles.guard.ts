import { Injectable } from '@nestjs/common';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles required
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('User roles not found or invalid');
    }

    return true;
  }
}
