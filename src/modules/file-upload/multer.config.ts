import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Allowed file types
const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const storage = diskStorage({
  destination: './uploads', // Store files in 'uploads/' folder
  filename: (req, file, cb) => {
    const fileExtName = extname(file.originalname);
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${randomName}${fileExtName}`);
  },
});

// File type validation
export const fileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: BadRequestException | null, arg1: boolean) => void) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new BadRequestException('Invalid file type! Only PNG, JPG, and JPEG are allowed.'), false);
  }
  cb(null, true);
};

// File size limit (2MB)
export const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};
