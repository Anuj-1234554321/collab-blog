
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { connectionSource } from '../config/orm.config';
import { FollowersModule } from './modules/followers/followers.module';
import { RedisModule } from './modules/redis/redis.module';
import { BlogPostModule } from './modules/blog-post/blog-post.module';
import { MarkdownModule } from './modules/markdown/markdown.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Load env variables globally
    TypeOrmModule.forRoot({...connectionSource.options,
      autoLoadEntities: true, 
    }),  // ✅ Database connection
    AuthModule, // ✅ Include AuthModule
    UsersModule, // ✅ Include UsersModule
    FollowersModule,
    RedisModule,
    BlogPostModule,
    MarkdownModule,
    FileUploadModule,
    TagModule,
    CategoryModule

    
    
  ],
  
  exports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UsersModule, 
    FollowersModule,
    RedisModule, 
    BlogPostModule,
    MarkdownModule,
    FileUploadModule,
    CategoryModule
    
    
  ],
})
export class GlobalModule {}


