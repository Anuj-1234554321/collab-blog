
  import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { Reflector } from "@nestjs/core";
  import { AuthService } from "../auth.service";
  import { UserRole } from "src/common/enums/user-role.enum";
  import { Request } from "express";

  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRoles: UserRole[] =
      this.reflector.get<UserRole[]>('roles', context.getHandler()) || // ✅ Check method-level metadata first
      this.reflector.get<UserRole[]>('roles', context.getClass()) || []; // ✅ Check controller-level metadata if method-level is not found
    
      if (requiredRoles.length === 0) return true; // No roles required → allow access

      const request = context.switchToHttp().getRequest();
      const user = request.user; // Extract user from request (added by JWT Auth Guard)
    
      if (!user) throw new ForbiddenException('Unauthorized');
      
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You do not have permission to access this resource.');
      }

      return true;
    }
  }
