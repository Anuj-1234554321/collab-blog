import { Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file type.');
    }

    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    };
  }
}
