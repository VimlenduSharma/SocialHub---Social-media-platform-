import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as userController from '@/controllers/user.controller';
import * as followController from '@/controllers/follow.controller';

const router = Router();

router.get('/me', authenticate, asyncHandler(userController.getMe));
router.put('/me', authenticate, asyncHandler(userController.updateMe));
router.post(                              
  '/:id/follow',
  authenticate,
  asyncHandler(followController.toggleFollow)
);    
router.get('/:username', asyncHandler(userController.getByUsername));

export default router;
