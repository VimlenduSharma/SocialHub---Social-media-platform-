import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as commentController from '@/controllers/comment.controller';

const router = Router();

router.post(
  '/:id',
  authenticate,
  asyncHandler(commentController.addComment)
);

export default router;
