/* ─────────────────────────────────────────────────────────────────────────────
   Upload Controller – Cloudinary direct-upload helpers
   Location : backend/src/controllers/upload.controller.ts
   ─────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadFiles } from '@/services/upload.service';
import { deleteByPublicId } from '@/config/cloudinary';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

const deleteSchema = z.object({
  publicId: z.string().min(1),
});

const querySchema = z.object({
  folder: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9/_-]+$/.test(val),
      'folder may only contain letters, numbers, /, _ or -'
    ),
});

/* -------------------------------------------------------------------------- */
/*                              Controllers                                   */
/* -------------------------------------------------------------------------- */

/**
 *  POST /api/uploads
 *  • multipart/form-data with field name **images**
 *  • Optional query ?folder=avatars  (defaults to "posts")
 *  Returns: { urls: string[] }
 */
export const uploadImages = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { folder = 'posts' } = querySchema.parse(req.query);

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || !files.length) {
    throw new AppError(400, 'No files received');
  }

  const urls = await uploadFiles(files, folder);

  return res.status(201).json({ urls });
};

/**
 *  DELETE /api/uploads/:publicId
 *  Removes an image from Cloudinary (useful when users replace avatars).
 *  Returns: { deleted: boolean }
 */
export const deleteImage = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { publicId } = deleteSchema.parse(req.params);

  const result = await deleteByPublicId(publicId);

  return res.json({ deleted: result.result === 'ok' });
};
