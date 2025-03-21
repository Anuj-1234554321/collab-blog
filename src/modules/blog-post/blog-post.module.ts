import { forwardRef, Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost,Tag,Category,User]),forwardRef(() => UsersModule),],
  controllers: [BlogPostController],
  providers: [BlogPostService,UserService],
  exports: [BlogPostService]
})
export class BlogPostModule {}
