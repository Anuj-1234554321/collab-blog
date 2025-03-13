import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import {UserRole} from 'src/common/enums/user-role.enum'


export class CreateUserDto {
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  name?: string;

@ValidateIf((obj) => obj.phone !== undefined) // Validate only if phone exists
@IsMobilePhone()
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @MaxLength(15)
  phone?: string;

  @IsEnum(UserRole)
  role?: UserRole; // ✅ Assign role at registration
}
