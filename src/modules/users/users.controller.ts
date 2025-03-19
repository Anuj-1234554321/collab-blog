import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ValidationPipe, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesGuard } from '../auth/gaurds/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Public, Roles } from '../auth/gaurds/roles.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
   
  ) {   
  }
  // ✅ User Registration
  @Public()
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { message: 'User registered successfully', user };
  }

  // ✅ User Login (Returns JWT Token)
  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password'); // ✅ Handle invalid login
    }
    const token = await this.authService.generateToken(user);
    return { access_token: token, user };
  }

  // ✅ Get Current User (Protected Route)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req:any) {
    return req.user; // User data from JWT payload
  }
  //findById
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<any> {
    return this.userService.findById(id);
  }
  // ✅ Update User (Protected Route)
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Req() req:any, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  // ✅ Delete User (Protected Route)

@Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('delete/:id')
  async deleteUser(@Req() req:any) :Promise<{message:string}>{
    await this.userService.remove(req.user.userId);
    return { message: 'User deleted successfully.' };
  }
   // ✅ Forgot Password - Sends OTP via Email or SMS
   @Public()
   @Post('forgot-password')
   async forgotPassword(@Body() forgatedPassword:ForgotPasswordDto ) {
    const { identifier,mode} = forgatedPassword;
    if (!identifier ||!mode) {
      throw new BadRequestException("Both identifier and mode are required.");
    }
     return this.userService.forgotPassword(identifier,mode);
   }

     // ✅ Verify OTP
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body()verifyOtpDto:VerifyOtpDto) {
    const { identifier,otp} = verifyOtpDto;
    if (!identifier||!otp) {
      throw new BadRequestException('Verification ID and OTP are required');
    }
    return this.userService.verifyOTP(identifier,otp);
    
  }


  // ✅ Reset Password After OTP Verification
  @Public()
   @Post('reset-password')
   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
     return this.userService.resetPassword(resetPasswordDto);
   }
}


