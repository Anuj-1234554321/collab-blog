import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { BlogPost } from '../blog-post/entities/blog-post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,

    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Handles reaction to a blog post.
   */
  async reactToPost(postId: number, createReactionDto: CreateReactionDto): Promise<Reaction> {
    const { userId, type } = createReactionDto;

    // Ensure user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Ensure blog post exists
    const post = await this.blogPostRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Blog post not found');

    // Check if the user has already reacted to this post
    let reaction = await this.reactionRepository.findOne({ where: { user, blogPost: post } });

    if (reaction) {
      // Update reaction type if already exists
      reaction.type = type;
    } else {
      // Create new reaction
      reaction = this.reactionRepository.create({ user, blogPost: post, type });
    }

    return await this.reactionRepository.save(reaction);
  }

  /**
   * Handles reaction to a comment.
   */
  async reactToComment(commentId: number, createReactionDto: CreateReactionDto): Promise<Reaction> {
    const { userId, type } = createReactionDto;

    // Ensure user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Ensure comment exists
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    // Check if the user has already reacted to this comment
    let reaction = await this.reactionRepository.findOne({ where: { user, comment } });

    if (reaction) {
      // Update reaction type if already exists
      reaction.type = type;
    } else {
      // Create new reaction
      reaction = this.reactionRepository.create({ user, comment, type });
    }

    return await this.reactionRepository.save(reaction);
  }
}
