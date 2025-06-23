import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as postController from '@/controllers/post.controller';
import * as commentController from '@/controllers/comment.controller';  
import * as bookmarkController from '@/controllers/bookmark.controller';

const router = Router();

router.post('/', authenticate, asyncHandler(postController.createPost));
router.post('/:id/like', authenticate, postController.likePost);
router.post(
  '/:id/bookmark',                                             
  authenticate,
  asyncHandler(bookmarkController.toggleBookmark)
);
router.post(
  '/:id/comment',
  authenticate,
  asyncHandler(commentController.addComment)   
);
router.get('/', postController.listFeed);
router.get('/:id', asyncHandler(postController.getPostById));

export default router;