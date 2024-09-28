import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAME } from './jwt.strategy';
import { Privilege } from './privilege';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_NAME) {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) {
      return false;
    }

    const requiredPrivileges = this.reflector.getAllAndOverride<
      Privilege[] | undefined
    >('requiredPrivileges', [context.getHandler(), context.getClass()]);
    if (!requiredPrivileges) {
      return false;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    return requiredPrivileges.every((privilege) =>
      user.privileges.includes(privilege),
    );
  }
}
