import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import {UserRole} from '../../../common/enums/user-role.enum'


export class CreateUserDto {
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  phoneNumber?: string; // ✅ Add phone number field at registration

  @IsEnum(UserRole)
  role?: UserRole; // ✅ Assign role at registration
}
