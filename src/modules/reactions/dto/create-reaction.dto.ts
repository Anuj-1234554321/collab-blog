import { IsEnum, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ReactionType } from 'src/common/enums/reaction.enum';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsInt()
  userId?: number;  // User reacting

  @IsOptional()
  @IsInt()
  PostId?: number | null;   // If reacting to a blog post

  @IsOptional()
  @IsInt()
  commentId?: number |null;  // If reacting to a comment

  @IsNotEmpty()
  @IsEnum(ReactionType ,{ message: 'Reaction type must be "like" or "dislike"' })
  type?: ReactionType;
}

