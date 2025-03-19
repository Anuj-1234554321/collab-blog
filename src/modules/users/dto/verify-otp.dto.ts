import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier?: string;

  @IsNotEmpty()
  @IsString()
  otp?: string;
}
