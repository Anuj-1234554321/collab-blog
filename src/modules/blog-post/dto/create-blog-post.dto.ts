import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100) // ✅ Title must be 5-100 characters
  title?: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 5000) // ✅ Content must be 20-5000 characters
  content?: string;

}
