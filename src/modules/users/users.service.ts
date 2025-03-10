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
import { Twilio } from "twilio";
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class UserService {
  private twilioClient;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => AuthService)) // ✅ Fix circular dependency
    private authService: AuthService,
  ) {
     this.twilioClient = new Twilio(
    this.configService.get<string>("TWILIO_ACCOUNT_SID"),
    this.configService.get<string>("TWILIO_AUTH_TOKEN")
  );
}

  /** 🔹 Create User (Prevent Duplicates + Hash Password) */
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
    await this.userRepository.delete(userId);
  }

  //forgate password
  async forgotPassword(identifier: string, mode: "email" | "sms") {
    const user = await this.findUser(identifier, mode);
    if (!user) throw new BadRequestException("User not found.");
    const otp = this.generateOTP();
    await this.redisService.setOTP(identifier, otp, 300);
    try {
      mode === "email" ? await this.sendOtpEmail(identifier, otp) : await this.sendOtpSms(identifier, otp);
    } catch (error) {
      console.error(`Failed to send OTP via ${mode.toUpperCase()}:`, error);
      throw new InternalServerErrorException("Failed to send OTP. Please try again.");
    }
    return { message: "OTP sent successfully." };
  }

// find User by email or phone number
  private async findUser(identifier: string, mode: "email" | "sms"): Promise<User | null> {
    return mode === "email"
      ? await this.userRepository.findOne({ where: { email: identifier } })
      : await this.userRepository.findOne({ where: { phone: identifier } });
  }
  
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ✅ Reset Password After OTP Verification
  async resetPassword(dto: ResetPasswordDto) {
    const { identifier, otp, newPassword } = dto;
    if(!newPassword){
      throw new Error('New password is required');
    } 
     

    // Verify OTP before resetting password
    const storedOtp = await this.redisService.getOTP(`OTP_${identifier}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
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
// send otp message by twilio
  private async sendOtpSms(phone: string, otp: string) {
    try {
      await this.twilioClient.messages.create({
        body: `Your OTP for password reset is: ${otp}`,
        from: this.configService.get<string>("TWILIO_PHONE_NUMBER"),
        to: phone,
      });

      console.log(`📱 OTP sent successfully to ${phone}`);
    } catch (error) {
      console.error("SMS send failed:", error);
      throw new InternalServerErrorException("Error sending OTP SMS.");
    }
  }

//set otpon mail with time
  async sendOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.setOTP(email, otp);
    console.log(`OTP ${otp} sent to ${email}`);
  }
  async verifyOTP(email: string, enteredOtp: string) {
    const storedOtp = await this.redisService.getOTP(email);
    if (storedOtp === enteredOtp) {
      console.log("OTP Verified!");
      return true;
    } else {
      console.log("Invalid OTP");
      return false;
    }
  }
}



