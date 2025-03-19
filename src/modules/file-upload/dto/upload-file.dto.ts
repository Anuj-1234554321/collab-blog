import { IsString, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  fileName?: string;

  @IsString()
  @IsNotEmpty()
  filePath?: string;
}
