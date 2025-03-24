import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlogStatus } from 'src/common/enums/blog-post.enum';
import { UserService } from '../users/users.service';
import { MarkdownService } from '../markdown/markdown.service';
import { marked } from 'marked';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';


@Injectable()
export class BlogPostService {
  getPostById(id: string) {
    throw new Error('Method not implemented.');
  }
  
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepository: Repository<BlogPost>,
    @Inject(forwardRef(() => UserService)) // ✅ Use forwardRef to resolve dependency
    private readonly userService: UserService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  
  ) {}

  // Create a new blog post (Draft by default)
   async createBlogPost(createBlogDto: CreateBlogPostDto, userId:number) :Promise<BlogPost> {
    const user = await this.userService.findById(userId);
    if(!user) throw new Error('No such user found for createBlogPost')
        // 2️⃣ Fetch Categories and Tags from DB
    const categories = createBlogDto.categories?.length
    ? await this.categoryRepository.findBy({ id: In(createBlogDto.categories) })
    : [];

    const tags = createBlogDto.tags?.length
    ? await this.tagRepository.findBy({ id: In(createBlogDto.tags) })
    : [];

    const newPost = this.blogRepository.create({
      ...createBlogDto,
      author: user,  // Assigning fetched User
      categories,    // Assigning fetched Categories
      tags,          // Assigning fetched Tags
      status: BlogStatus.DRAFT,
    } as DeepPartial<BlogPost>);
    return this.blogRepository.save(newPost);
  }

 // Get a single blog post by ID
 async getBlogPostById(id: number): Promise<BlogPost> {
  const post = await this.blogRepository.findOne({ where: { id }, relations: ['author'] });
  if (!post) throw new NotFoundException('Blog post not found');
  return post;
}
// Get all posts
async getAllBlogPosts(
  page?: number, 
  limit?: number, 
  sortBy?: string, 
  sortOrder?: 'ASC' | 'DESC'
): Promise<{ data: BlogPost[]; total: number; page: number; limit: number }> {
  
  // If no values are provided, set defaults
  const pageNum = Math.max(1, page || 1);
  const limitNum = Math.max(1, limit || 10);
  const sortField = sortBy || 'createdAt';
  const order: 'ASC' | 'DESC' = sortOrder || 'DESC';

  const skip = (pageNum - 1) * limitNum;

  const total = await this.blogRepository.count();

  const blogPosts = await this.blogRepository.find({
    relations: ['categories', 'tags', 'author'],
    order: { [sortField]: order },
    skip,
    take: limitNum,
  });

  return { data: blogPosts, total, page: pageNum, limit: limitNum };
}





  // Update a blog post (only if the user is the author)
  async updateBlogPost(id: number, updateBlogDto: UpdateBlogPostDto, userId:number): Promise<BlogPost> {
    const post = await this.getBlogPostById(id);

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    if (post.author?.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this post');
    }

    Object.assign(post, updateBlogDto);
    return this.blogRepository.save(post);
  }
  // Publish a blog post (only the author can publish)
  async publishBlogPost(id: number, userId:number): Promise<BlogPost> {
    const post = await this.getBlogPostById(id);
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    if (post.author?.id !== userId) {
      throw new ForbiddenException('You are not allowed to publish this post');
    }

    post.status = BlogStatus.PUBLISHED;
    return this.blogRepository.save(post);
  }

 // Delete a blog post (only the author or an admin can delete)
 async deleteBlogPost(id: number, userId: number): Promise<{ message: string }> {
  const post = await this.getBlogPostById(id);

  if (post.author?.id !== userId) {
    throw new ForbiddenException('You are not allowed to delete this post');
  }

  await this.blogRepository.delete(id);
  return { message: 'Blog post deleted successfully' };
}
}
