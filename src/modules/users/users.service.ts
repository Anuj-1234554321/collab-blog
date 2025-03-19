import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  Inject, 
  forwardRef, 
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PhoneNumber } from 'libphonenumber-js';
import { VerificationMode } from 'src/common/enums/verification-mode.enum';




@Injectable()
export class UserService {
  delete(id: any) {
    throw new Error('Method not implemented.');
  }
  client: any;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService)) // ✅ Fix circular dependency
    private authService: AuthService,
  ) {
}

  //* 🔹 Create User (Prevent Duplicates + Hash Password) */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    if (!password) {
      throw new Error('Password is required');
    }

    // ✅ Check if email is already registered
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // ✅ Hash password
    const hashedPassword = await this.authService.hashPassword(password);

    // ✅ Create user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  /** 🔹 Find User by ID */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /** 🔹 Find User by Email */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /** 🔹 Update User (Ensure User Exists) */
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ✅ Merge updates & save
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /** 🔹 Delete User (Ensure User Exists) */
  async remove(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const deleteResult = await this.userRepository.delete(userId);
    if (!deleteResult.affected) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
  }
  }

  //forgate password
  async forgotPassword(identifier: string,mode: VerificationMode) {
  const user = await this.findUser(identifier, mode);
     if (!user) throw new BadRequestException("User not found.");
        try {
             if (mode ===VerificationMode.EMAIL) {
             // ✅ Generate OTP & store in Redis
            const otp = this.generateOTP();
            const isStored = await this.redisService.setOTP(identifier, otp, 300)
            if (!isStored) {
            console.error(`Failed to store OTP for ${identifier}`);
            throw new InternalServerErrorException("Error generating OTP. Please try again.");
            }
            console.log(`✅ OTP stored in Redis: ${otp} for ${identifier}`);
            await this.sendOtpEmail(identifier, otp);
  
          } else if (mode === VerificationMode.SMS) {
        //   // ✅ Use Firebase to send OTP via SMS
        //    const verificationId = await this.firebaseService.sendOtp(identifier);
        //     if (!verificationId) {
        //      throw new InternalServerErrorException("Failed to generate OTP for SMS.");
        //     }
        
        // console.log(`📱 OTP request sent via Firebase to ${identifier}`);
        // return { message: "OTP sent successfully.", verificationId };
      }
      
    } catch (error) {
      console.error(`Failed to send OTP via ${mode.toUpperCase()} for ${identifier}:`, error);
    throw new InternalServerErrorException("Failed to send OTP. Please try again.");
      
    }
  }

// find User by email or phone number
  private async findUser(identifier: string, mode: VerificationMode): Promise<User | null> {
    return mode === VerificationMode.EMAIL
      ? await this.userRepository.findOne({ where: { email: identifier } })
      : await this.userRepository.findOne({ where: { phone: identifier } });
  }
  
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ✅ Reset Password After OTP Verification
  async resetPassword(dto: ResetPasswordDto) {
    const { identifier, newPassword } = dto;
    if(!newPassword || !identifier){
      throw new Error('Identifier and password must be required for reset password');
    } 
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) throw new NotFoundException('User not found');
    // Hash new password
    const hashedPassword =  await this.authService.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    // Remove OTP from Redis after successful reset
    await this.redisService.deleteOTP(`OTP_${identifier}`);
    return { message: 'Password reset successful' };
  }
    // �� Send OTP via email and SMS (use Twilio or Nodemailer)
  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.configService.get<string>("EMAIL_USER"),
        pass: this.configService.get<string>("EMAIL_PASS"),
      },
    });

    try {
      await transporter.sendMail({
        from: `"Support Team" <${this.configService.get<string>("EMAIL_USER")}>`,
        to: email,
        subject: "Reset Password OTP",
        text: `Your OTP for password reset is: ${otp}`,
      });

      console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      console.error("Email send failed:", error);
      throw new InternalServerErrorException("Error sending OTP email.");
    }
  }
//set otpo n mail with time
async sendOTP(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await this.redisService.setOTP(email, otp);
  // Retrieve OTP immediately to check if it's stored
  const storedOTP = await this.redisService.getOTP(email);
  console.log(`Stored OTP in Redis:`, storedOTP); 
  if (!storedOTP) {
    console.error(`Failed to store OTP for ${email}`);
  } else {
    console.log(`OTP ${storedOTP} stored successfully for ${email}`);
  }
  console.log(`OTP ${otp} sent to ${email}`);
}

  async verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.getOTP(identifier);
    // Only delete the OTP **AFTER** verification is successful
    await this.redisService.deleteOTP(identifier);
    return true;
  }
  
}

