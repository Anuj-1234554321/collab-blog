import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionController } from './reactions.controller';
import { Reaction } from './entities/reaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../blog-post/entities/blog-post.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { BlogPostModule } from '../blog-post/blog-post.module';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction,BlogPost,User,Comment]),UsersModule,BlogPostModule], 
  controllers: [ReactionController],
  providers: [ReactionsService],
  exports: [ReactionsService]
})
export class ReactionsModule {}
