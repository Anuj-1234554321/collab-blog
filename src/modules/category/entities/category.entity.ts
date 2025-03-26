import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name?: string;

  @ManyToMany(() => BlogPost, (blogPost: { categories: any; }) => blogPost.categories)
  blogPosts?: BlogPost[];
}
