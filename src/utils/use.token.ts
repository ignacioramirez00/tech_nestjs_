import { envs } from '../config/envs';
import { AuthtokenResult } from '../auth/interface/auth.interface';
import { Authtoken } from '../auth/interface/auth.interface';
import * as jwt from 'jsonwebtoken';
export const useToken = (token: string): Authtoken | string => {
  try {
    const decode = jwt.verify(token, envs.jwtSecret) as AuthtokenResult;
    return {
      id: decode.id,
      username: decode.username,
      email: decode.email,
      isExpired: decode.exp * 1000 < Date.now(),
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return 'Token expired';
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return 'Invalid token';
    }
    throw new Error('Token validation error');
  }
};
