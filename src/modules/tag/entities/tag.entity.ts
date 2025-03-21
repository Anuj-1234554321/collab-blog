import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name?: string;

  @ManyToMany(() => BlogPost, (blogPost) => blogPost.tags)
  blogPosts?: BlogPost[];
}
