import { IsString, IsEnum } from 'class-validator';
import { VerificationMode } from 'src/common/enums/verification-mode.enum';

export class ForgotPasswordDto {
  @IsString()
  identifier?: string; // Email or Phone Number

  @IsEnum(VerificationMode, { message: 'Mode must be either email or sms' })
  mode?: VerificationMode;
}
