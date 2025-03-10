import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}
@Post()
async followUser(@Req() req:any, @Body() createFollowDto: CreateFollowerDto) {
  const userId = req.user.userId;
    if(!userId){
      throw new Error('User not found');
    }
    if(!createFollowDto.followingId){
      throw new Error('Following id is required');
    }
  return this.followersService.followUser(userId, createFollowDto.followingId);
}
@Delete('unfollow')
async unfollow(@Param('id')followingId:number,@Req() req:any):Promise<{message:string}>{
 this.followersService.unfollowUser(req.user.id,followingId)
 return {
  message: `User has unfollowed successfully.`,
};
}

@Get(':id/follower')
async getFollowers(@Param('id') userId:number): Promise<any> {
  return this.followersService.getFollowers(userId);
}
@Get(':id/following')
async getFollowing(@Param('id') userId:number): Promise<any> {
  return this.followersService.getFollowing(userId);
}


}
