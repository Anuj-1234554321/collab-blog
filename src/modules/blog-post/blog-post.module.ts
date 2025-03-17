import { forwardRef, Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost,User])],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService]
})
export class BlogPostModule {}
