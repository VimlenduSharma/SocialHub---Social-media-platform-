import { Router } from 'express';
import multer from 'multer';

import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as uploadController from '@/controllers/upload.controller';

const router = Router();

// Multer → keep files in memory; 8 MB per file, max 4 files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 4 },
});

router.post(
  '/',
  authenticate,
  upload.array('images', 4),
  asyncHandler(uploadController.uploadImages)
);

router.delete(
  '/:publicId',
  authenticate,
  asyncHandler(uploadController.deleteImage)
);

export default router;
