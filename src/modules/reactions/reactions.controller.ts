import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionsService) {}

  // React to a blog post
  @Post('blog-post/:postId')
  async reactToPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createReactionDto: CreateReactionDto
  ) {
    return this.reactionService.reactToPost(postId, createReactionDto);
  }

  // React to a comment
  @Post('comment/:commentId')
  async reactToComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() createReactionDto: CreateReactionDto
  ) {
    return this.reactionService.reactToComment(commentId, createReactionDto);
  }
}
