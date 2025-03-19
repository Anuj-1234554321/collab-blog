import { Module } from '@nestjs/common';
import { UploadService } from './file-upload.service';
import { UploadController } from './file-upload.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class FileUploadModule {}
