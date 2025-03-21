import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../blog-post/entities/blog-post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tag,BlogPost])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
