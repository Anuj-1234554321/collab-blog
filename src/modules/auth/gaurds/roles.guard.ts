import { Injectable,CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { UserRole } from "src/common/enums/user-role.enum";

@Injectable()
export class RolesGaurd implements CanActivate {
    reflector: any;
    constructor(private readonly authService: AuthService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles: UserRole[] = this.reflector.get('roles', context.getHandler()) || [];
        if (!requiredRoles) return true; // No roles required → allow access
        const request = context.switchToHttp().getRequest<Request | any>();
        const user = request.user; // Extract user from request (added by JWT Auth Guard)
    
        if (!user) throw new ForbiddenException('Unauthorized');
    
        if (!requiredRoles.includes(user.role)) {
           throw new ForbiddenException('You do not have permission to access this resource.');
        }
        return true;
      }
}
