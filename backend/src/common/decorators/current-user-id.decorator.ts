import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { AuthUser } from '../../auth/types/auth-user.type';

export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();

    if (!req.user) {
      // mensagem clara: você usou o decorator sem Guard
      throw new UnauthorizedException('Missing authenticated user');
    }

    return req.user.id;
  },
);
