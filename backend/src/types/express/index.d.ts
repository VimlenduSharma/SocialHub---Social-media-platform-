import 'express-serve-static-core';
import type { File as MulterFile } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      uid: string;
      email: string;
      name?: string;
      picture?: string;
    };
    files?: MulterFile[];
    file?: MulterFile;
  }
}
