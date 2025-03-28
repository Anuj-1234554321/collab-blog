import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { AuthModule } from '../auth/auth.module'; // Ensure this is correct
import { FollowersModule } from '../followers/followers.module';
import { FollowersService } from '../followers/followers.service';
import { RedisModule } from '../redis/redis.module';
import { BlogPost } from '../blog-post/entities/blog-post.entity';
import { BlogPostModule } from '../blog-post/blog-post.module';
import { Reaction } from '../reactions/entities/reaction.entity';
import { Comment } from '../comments/entities/comment.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User,BlogPost,Comment,Reaction]), // ✅ Ensure User entity is imported
    forwardRef(() => AuthModule), // ✅ Fix circular dependency issue
    forwardRef(() => FollowersModule),
    forwardRef(() => BlogPostModule),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ✅ Export UsersService to be used in AuthModule
})
export class UsersModule {}
