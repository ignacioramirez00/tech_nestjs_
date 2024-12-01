import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../../user/entities/user.entity';
import { envs } from '../../config/envs';
import { ErrorManager } from '../../utils/error.manager';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginUser(username: string, password: string) {
    try {
      const userUsername = await this.userService.findBy({
        key: 'username',
        value: username,
      });
      const userEmail = await this.userService.findBy({
        key: 'email',
        value: username,
      });
      if (userUsername) {
        const result = await bcrypt.compare(password, userUsername.password);
        if (result) {
          return userUsername;
        } else {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Invalid password',
          });
        }
      }
      if (userEmail) {
        const result = await bcrypt.compare(password, userEmail.password);
        if (result) {
          return userEmail;
        } else {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Invalid password',
          });
        }
      } else {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid credentials - not exists user',
        });
      }
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }

  public signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: string | number;
  }) {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  async generateToken(user: UserEntity): Promise<any> {
    try {
      //const userId = await this.userService. evito ir de nuevo a la BD
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      return {
        access_token: this.signJWT({
          payload,
          secret: envs.jwtSecret,
          expires: envs.jwtExpires,
        }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
