import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString } from "class-validator";
export class CreateBlogPostDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categories?: number[]; // Array of category IDs

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  tags?: number[]; // Array of tag IDs
}
 
