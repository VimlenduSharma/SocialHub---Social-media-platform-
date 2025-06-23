/* ────────────────────────────────────────────────────────────────────────────
   Upload Service – wraps Cloudinary uploads / deletions
   Location : backend/src/services/upload.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import type { Express } from 'express';

import { uploadBuffer, deleteByPublicId } from '@/config/cloudinary';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                             Config / Limits                                */
/* -------------------------------------------------------------------------- */

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE_MB = 8;                // enforced again just in case

/* -------------------------------------------------------------------------- */
/*                           Types / Interfaces                               */
/* -------------------------------------------------------------------------- */

export interface UploadedFile {
  url: string;
  publicId: string;
}

/* -------------------------------------------------------------------------- */
/*                                Helpers                                     */
/* -------------------------------------------------------------------------- */

const validateFile = (file: Express.Multer.File) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new AppError(400, `Unsupported file type: ${file.mimetype}`);
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    throw new AppError(400, `File ${file.originalname} exceeds ${MAX_FILE_SIZE_MB} MB`);
  }
};

/* -------------------------------------------------------------------------- */
/*                             Service APIs                                   */
/* -------------------------------------------------------------------------- */

/**
 * Upload an array of files (buffers) to Cloudinary.
 * Returns: [{ url, publicId }]
 */
export const uploadFiles = async (
  files: Express.Multer.File[],
  folder = 'socialhub'
): Promise<UploadedFile[]> => {
  const results: UploadedFile[] = [];

  for (const file of files) {
    validateFile(file);

    const { secure_url, public_id } = await uploadBuffer(file.buffer, folder);

    results.push({
      url: secure_url,
      publicId: public_id,
    });
  }

  return results;
};

/**
 * Delete an asset on Cloudinary (wrapper around deleteByPublicId).
 * Returns `true` if deletion succeeded.
 */
export const deleteFile = async (publicId: string): Promise<boolean> => {
  const res = await deleteByPublicId(publicId);
  return res.result === 'ok';
};
