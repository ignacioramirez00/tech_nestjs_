import { Body, Controller, Post } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRegisterDto } from '../dto/UserRegister.dto';
import { UserService } from '../services/user.service';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  public registerUSer(@Body() user: UserRegisterDto): Promise<UserEntity> {
    return this.userService.registerUser(user);
  }
}
