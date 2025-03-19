import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  identifier?: string; // Can be email or phone
  
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword?: string;
  //otpCode
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least' })
  otpCode?: string;
}
