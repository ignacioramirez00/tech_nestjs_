import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Authtoken } from '../interface/auth.interface';
import { useToken } from '../../utils/use.token';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = request.headers['fudo_token'];

      const manageToken: Authtoken | string = useToken(token);

      if (manageToken === 'Token expired') {
        throw new UnauthorizedException('Token expired');
      }
      if (manageToken === 'Invalid token') {
        throw new UnauthorizedException('Invalid token');
      }
      if (typeof manageToken === 'string') {
        throw new UnauthorizedException('Token error');
      }

      const { id } = manageToken;
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request['user'] = {
        id: manageToken.id,
        username: manageToken.username,
        email: manageToken.email,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
