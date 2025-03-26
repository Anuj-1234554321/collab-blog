import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ReactionType } from 'src/common/enums/reaction.enum';

@Entity()
@Unique(['user', 'blogPost'])  // A user can react only once per blog post
@Unique(['user', 'comment'])   // A user can react only once per comment
export class Reaction {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  user?: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.reactions, { nullable: true, onDelete: 'CASCADE' })
  blogPost?: BlogPost;  // Reaction can be linked to either a blog post...

  @ManyToOne(() => Comment, (comment) => comment.reactions, { nullable: true, onDelete: 'CASCADE' })
  comment?: Comment;  // ...or a comment.

 @Column({ type: 'enum', enum: ReactionType })
type?: ReactionType;
}





