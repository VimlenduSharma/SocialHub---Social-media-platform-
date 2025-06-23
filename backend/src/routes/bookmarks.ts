import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as bookmarkController from '@/controllers/bookmark.controller';

const router = Router();

router.get('/', authenticate, asyncHandler(bookmarkController.listBookmarks));

export default router;
