import type { File as MulterFile } from 'multer';
import { uploadBuffer, deleteByPublicId } from '@/config/cloudinary';
import { AppError } from '@/utils/AppError';


const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE_MB = 8;           
export interface UploadedFile {
  url: string;
  publicId: string;
}


const validateFile = (file: MulterFile) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new AppError(400, `Unsupported file type: ${file.mimetype}`);
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    throw new AppError(400, `File ${file.originalname} exceeds ${MAX_FILE_SIZE_MB} MB`);
  }
};

export const uploadFiles = async (
  files: MulterFile[],
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

export const deleteFile = async (publicId: string): Promise<boolean> => {
  const res = await deleteByPublicId(publicId);
  return res.result === 'ok';
};
