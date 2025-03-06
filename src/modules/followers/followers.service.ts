  import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
  import { CreateFollowerDto } from './dto/create-follower.dto';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Follow } from './entities/follower.entity';
  import { UserService } from '../users/users.service';

  @Injectable()
  export class FollowersService {
    constructor(
      @InjectRepository(Follow) private followRepository: Repository<Follow>,
      @Inject(forwardRef(() => UserService)) 
      private readonly usersService: UserService
    
    ) {}
  
    async followUser(userId: number, followingId: number) {
      if (userId === followingId) {
        throw new BadRequestException("You can't follow yourself.");
      }
  
      const follower = await this.usersService.findById(userId);
      const following = await this.usersService.findById(followingId);
  
      if (!follower) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
      if (!following) {
        throw new NotFoundException(`User with ID ${followingId} not found.`);
      }
  
      // Check if already following
      const existingFollow = await this.followRepository.findOne({
        where: { follower: { id: userId }, following: { id: followingId } },
        relations: ['follower', 'following']
      });
  
      if (existingFollow) {
        throw new BadRequestException('Already following this user.');
      }
  
      const follow = this.followRepository.create({ follower, following });
      return this.followRepository.save(follow);
    }
  
    async unfollowUser(followerId: number, followingId: number) {
      const follow = await this.followRepository.findOne({
        where: { follower: { id: followerId }, following: { id: followingId } }
      });
  
      if (!follow) {
        throw new BadRequestException("You're not following this user.");
      }
    return await this.followRepository.remove(follow);
  }
  async getFollowers(userId:number):Promise<Follow[]> {
    return this.followRepository.find({ where: { following: { id: userId } }, relations: ['follower'] })

  }
  async getFollowing(userId:number){
    return this.followRepository.find({ where: { follower: { id: userId } }, relations: ['following'] })
  }
}
