import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
// Custom decorator to mark a route as public (skips global guards)
export const Public = () => SetMetadata('isPublic', true);

