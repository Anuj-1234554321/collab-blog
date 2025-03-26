import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';
import { Reaction } from 'src/modules/reactions/entities/reaction.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  content?: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author?: User;

  @ManyToOne(() => BlogPost, (post) => post.comments, { onDelete: 'CASCADE' })
  blogPost?: BlogPost;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parentComment?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.comment, { cascade: true })
  reactions?: Reaction[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
