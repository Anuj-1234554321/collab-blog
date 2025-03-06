import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  Inject, 
  forwardRef 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService)) // ✅ Fix circular dependency
    private authService: AuthService,
  ) {}

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
}
