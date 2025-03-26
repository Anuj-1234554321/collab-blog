import { Controller, Post, Get, Delete, Body, Param, Request, BadRequestException } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(@Request() req: any, @Body() createCommentDto: CreateCommentDto) {
    console.log("Incoming Request:", createCommentDto);
    const { postId, content, parentId } = createCommentDto;
  
    if (!postId || !content) {
      throw new BadRequestException('Post ID and content are required');
    }
    // Ensure parentId is either a number or undefined
    const validParentId: number | undefined = parentId === undefined || parentId === null ? undefined : parentId;
  
    if (validParentId !== undefined && isNaN(validParentId)) {
      throw new BadRequestException('Invalid parent ID');
    }
    return await this.commentService.addComment(req.user.id, postId, content, validParentId);
    
  }
  @Get(':postId')
  getComments(@Param('postId') postId: string) {
    return this.commentService.getComments(postId);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
