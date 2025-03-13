import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true; // ✅ Allow access to public routes

    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return firstValueFrom(result); // ✅ Convert Observable to Promise
    }
    return result;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      console.error('Invalid or expired token:', info?.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
    request.user = user; // ✅ Attach user to request
    return user;
  }
}
