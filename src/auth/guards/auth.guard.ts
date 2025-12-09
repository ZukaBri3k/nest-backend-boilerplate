import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'generated/prisma/client';
import { Observable } from 'rxjs';

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

    let payload: User;
    try {
      payload = this.jwt.verify(request.headers.authorization!);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (payload) {
      request['user'] = payload;

      // Get roles from metadata (if any)
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      // If roles are specified, check if user has required role or is ADMIN
      if (roles && roles.length > 0) {
        const allowedRoles = [...roles, 'ADMIN'];
        if (!allowedRoles.includes(payload.role)) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }
}
