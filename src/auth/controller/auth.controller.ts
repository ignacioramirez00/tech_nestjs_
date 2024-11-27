import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dto/UserLogin.dto';
import { AuthService } from '../service/auth.service';
import { ErrorManager } from '../../utils/error.manager';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async loginUser(@Body() user: LoginDto) {
    try {
      const userLogin = await this.authService.loginUser(
        user.username,
        user.password,
      );
      if (userLogin) {
        return await this.authService.generateToken(userLogin);
      }
    } catch (error) {
      throw ErrorManager.createSignetureError(error.message);
    }
  }
}
