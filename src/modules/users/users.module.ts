import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { AuthModule } from '../auth/auth.module'; // Ensure this is correct
import { FollowersModule } from '../followers/followers.module';
import { FollowersService } from '../followers/followers.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Ensure User entity is imported
    forwardRef(() => AuthModule), // ✅ Fix circular dependency issue
    forwardRef(() => FollowersModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ✅ Export UsersService to be used in AuthModule
})
export class UsersModule {}
