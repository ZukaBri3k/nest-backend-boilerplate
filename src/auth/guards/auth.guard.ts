import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const payload = this.jwt.verifyToken(request.headers.authorization!);
    if (payload) {
      request['user'] = payload;

      // Get roles from metadata (if any)
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      // If roles are specified, check if user has required role or is ADMIN
      if (roles && roles.length > 0) {
        const allowedRoles = [...roles, 'ADMIN'];
        if (!allowedRoles.includes(payload.role!)) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }
}
