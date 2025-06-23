/* ─────────────────────────────────────────────────────────────────────────────
   Cloudinary – initialise once & expose convenient helpers
   Location : backend/src/config/cloudinary.ts
   Dependencies : `npm i cloudinary @types/cloudinary`
   ─────────────────────────────────────────────────────────────────────────── */

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/* -------------------------------------------------------------------------- */
/*                            Environment Safety-Net                          */
/* -------------------------------------------------------------------------- */

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    '❌  Missing Cloudinary env vars. ' +
      'Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env.'
  );
}

/* -------------------------------------------------------------------------- */
/*                               Initialisation                               */
/* -------------------------------------------------------------------------- */

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Upload an **in-memory Buffer** (e.g. from Multer) to Cloudinary.
 *
 * @param buffer        Raw file buffer
 * @param folder        Optional Cloudinary folder (default `"uploads"`)
 * @param resourceType  `"image" | "video" | "raw"`  (default `"image"`)
 * @returns             `{ secure_url, public_id }`
 */
export const uploadBuffer = (
  buffer: Buffer,
  folder = 'uploads',
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ secure_url: string; public_id: string }> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

/**
 * Convenience helper to delete a file by its `public_id`.
 */
export const deleteFile = (publicId: string): Promise<void> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { invalidate: true, resource_type: 'image' },
      (error) => {
        if (error) return reject(error);
        resolve();
      }
    );
  });

/* -------------------------------------------------------------------------- */
/*                                Re-exports                                  */
/* -------------------------------------------------------------------------- */

export { cloudinary };
