import { forwardRef, Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follower.entity';

@Module({
  imports: [  TypeOrmModule.forFeature([Follow]), forwardRef(()=>UsersModule)],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports:[FollowersService,]
})
export class FollowersModule {}
