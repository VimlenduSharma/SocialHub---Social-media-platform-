import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:      true,
});
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

export { cloudinary };
