import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { BlogStatus } from 'src/common/enums/blog-post.enum';

@Entity({ name: 'blog_posts' })
export class BlogPost {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  title?: string;

  @Column({ type: 'text' })
  content?: string;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
  status?: BlogStatus;

  @ManyToOne(() => User, (user) => user.blogPosts, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'authorId' }) // ✅ Ensures foreign key is mapped correctly
  author?: User;
  

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
