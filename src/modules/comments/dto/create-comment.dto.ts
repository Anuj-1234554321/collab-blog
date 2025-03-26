import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID() // Ensures postId is a valid UUID (TypeORM uses UUIDs commonly)
  postId?: number;

  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  parentId?: number | null;
}
