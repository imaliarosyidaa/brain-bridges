// role.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Kunci metadata untuk role
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
