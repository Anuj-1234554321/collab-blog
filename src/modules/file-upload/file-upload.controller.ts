import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './file-upload.service';
import { storage, fileFilter, limits } from './multer.config';
import { Public } from '../auth/gaurds/roles.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter, limits }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
