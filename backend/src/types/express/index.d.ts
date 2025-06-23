import '@types/express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      uid: string;
      email: string;
      name?: string;
      picture?: string;
    };
  }
}
