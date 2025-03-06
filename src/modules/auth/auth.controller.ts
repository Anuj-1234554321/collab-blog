import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { UserService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    // ✅ Validate Input
    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    // ✅ Validate User Credentials
    const user = await this.authService.validateUser(email, password);

    // ✅ Generate JWT Token
    const token = this.authService.generateToken(user);

    return { access_token: token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
