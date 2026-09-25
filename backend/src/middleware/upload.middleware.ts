import multer from 'multer';
import { AppError } from '../utils/AppError';
import { Request } from 'express';

// Use memory storage for buffer access before uploading to S3
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Validate MIME types securely
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/zip', 'application/json'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only standard images, SVGs, PDFs, and ZIPs are allowed.', 400));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter
});
