import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { BlogPost } from '../blog-post/entities/blog-post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async addComment(userId: number, blogPostId: number, content: string, parentCommentId?: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const blogPost = await this.blogPostRepository.findOne({ where: { id: blogPostId } });

    if (!user || !blogPost) {
        throw new NotFoundException('User or Blog Post not found');
    }

    let parentComment: Comment | undefined;
    if (parentCommentId) {
        const foundComment = await this.commentRepository.findOne({ where: { id: parentCommentId } });
        if (!foundComment) {
            throw new NotFoundException('Parent comment not found');
        }
        parentComment = foundComment; // No need for `|| undefined`, it's already undefined if not found.
    }

    // ✅ Create new comment outside of the if block
    const newComment = this.commentRepository.create({
        content,
        author: user,
        blogPost,
        ...(parentComment && { parentComment }), // Only include if parentComment exists
    });

    try {
        const savedComment = await this.commentRepository.save(newComment);
        const comments = await this.commentRepository.find();
        return savedComment;
    } catch (error) {
        console.error("Error saving comment:", error);
        throw new InternalServerErrorException("Failed to save comment");
    }
}
  async getComments(postId: string) {
    return this.commentRepository.find({
      where: { blogPost: { id: Number(postId) } },
      relations: ['author', 'replies'],
    });
  }

  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted' };
  }
}
