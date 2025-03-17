import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlogStatus } from 'src/common/enums/blog-post.enum';
import { UserService } from '../users/users.service';


@Injectable()
export class BlogPostService {
  
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepository: Repository<BlogPost>,
    @InjectRepository(User)  
    private readonly userRepository: Repository<User>, // ✅ Ensure User repo is injected
    private readonly userService: UserService,
  
  ) {}

  // Create a new blog post (Draft by default)
  async createBlogPost(createBlogDto: CreateBlogPostDto, userId:number) :Promise<BlogPost> {
    const user = await this.userService.findById(userId);
    if(!user) throw new Error('No such user found for createBlogPost')
    const newPost = this.blogRepository.create({ ...createBlogDto, author:user, status: BlogStatus.DRAFT });
    return this.blogRepository.save(newPost);
  }

 // Get a single blog post by ID
 async getBlogPostById(id: number): Promise<BlogPost> {
  const post = await this.blogRepository.findOne({ where: { id }, relations: ['author'] });
  if (!post) throw new NotFoundException('Blog post not found');
  return post;
}
// Get all posts
async getAllBlogPosts():Promise<BlogPost[]>{
  return this.blogRepository.find({ relations: ['author'] });
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
