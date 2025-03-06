import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFollowerDto {
  @IsNotEmpty({ message: 'Following ID is required' })
  @IsNumber({}, { message: 'Following ID must be a number' })
  followingId?: number;
}
