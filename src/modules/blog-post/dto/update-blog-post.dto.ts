import { IsString, IsOptional, Length, IsEnum, IsNotEmpty } from 'class-validator';
import { BlogStatus } from '../../../common/enums/blog-post.enum'; // ✅ Import the enum

export class UpdateBlogPostDto {
  @IsString()
  @IsOptional()
  @Length(5, 100)
  title?: string;

  @IsString()
  @IsOptional()
  @Length(20, 5000)
  content?: string;

  @IsEnum(BlogStatus) // ✅ Ensures status is only one of the allowed values
  @IsOptional()
  status?: BlogStatus;

}
