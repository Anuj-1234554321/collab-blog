import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, NotFoundException} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import {Request} from 'express'
import { UserRole } from 'src/common/enums/user-role.enum';
import { Public, Roles } from '../auth/gaurds/roles.decorator';
import { MarkdownService } from '../markdown/markdown.service';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogService: BlogPostService,
    private readonly markdownService: MarkdownService,
  ) {}
 // Create a blog post (only authenticated users)
 @Post('create')
 async createBlog(@Body() createBlogDto: CreateBlogPostDto,@Req() req: any) {
  const userId = req.user.userId;
  if(!userId) throw new Error('user found not found');
   return this.blogService.createBlogPost(createBlogDto, userId);
 }

// Get a single blog post
@Get(':id')
async getBlog(@Param('id') id: number) {
  const blog = await this.blogService.getBlogPostById(id);
  if (!blog) {
    throw new NotFoundException('Blog post not found');
  }
  return {
    ...blog,
    content: await this.markdownService.parseMarkdown(blog.content || ''),// Convert Markdown to HTML
  }
}
// Get All blog Posts
@Public()
@Get()
async getAllBlogs() {
  return this.blogService.getAllBlogPosts();
}

  // Publish a blog post (only the author)
@Patch('publish/:id')
  async publishBlog(@Param('id',ParseIntPipe) id: number, @Req() req:any) {
    return this.blogService.publishBlogPost(id, req.user.userId);
  }
  
// Update a blog post (only the author)
@Patch('update/:id')
async updateBlog(@Param('id',ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogPostDto, @Req() req:any) {
  return this.blogService.updateBlogPost(id, updateBlogDto, req.user.userId);
}
// Delete a blog post (only the author or an admin)

 @Delete('delete/:id')
 @Roles(UserRole.ADMIN, UserRole.EDITOR)
 async deleteBlog(@Param('id') id: number, @Req() req: any): Promise<{message:string,data:any}>{
  const deletedData = this.blogService.deleteBlogPost(id, req.user.userId);
   return {
     message: 'Blog post deleted successfully',
     data: deletedData,
   };
 }
 
}


