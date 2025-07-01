import type { Request, Response } from 'express';
import {
  uploadFiles,
  deleteFile,
} from '@/services/upload.service';          
import { AppError } from '@/utils/AppError';
import {
  uploadImagesQuerySchema,
  uploadDeleteParamsSchema,
} from '@/utils/validators';

// upload.controller.ts

export const uploadImages = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { folder = 'posts' } = uploadImagesQuerySchema.parse(req.query);

  // Now TS knows `req.files` exists
  const files = req.files!;
  if (!files.length) throw new AppError(400, 'No files received');

  // uploadFiles returns UploadedFile[] (with url & publicId)
  const images = await uploadFiles(files, folder);
  return res.status(201).json({ images });
};

export const deleteImage = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { publicId } = uploadDeleteParamsSchema.parse(req.params);

  // deleteFile (from the service!) returns a boolean
  const deleted = await deleteFile(publicId);
  return res.json({ deleted });
};

