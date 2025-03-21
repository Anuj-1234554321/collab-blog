import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { BlogStatus } from 'src/common/enums/blog-post.enum';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';

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

  @ManyToMany(() => Category, (category) => category.blogPosts, { cascade: true })
  @JoinTable()
  categories?: Category[];

  @ManyToMany(() => Tag, (tag) => tag.blogPosts, { cascade: true })
  @JoinTable()
  tags?: Tag[];
  

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
