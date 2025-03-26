import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { BlogPostModule } from '../blog-post/blog-post.module';
import { BlogPost } from '../blog-post/entities/blog-post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Comment,BlogPost,User]), // ✅ Ensure User entity is imported
     BlogPostModule,UsersModule], 
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
