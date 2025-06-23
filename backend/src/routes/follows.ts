import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as followController from '@/controllers/follow.controller';

const router = Router();

router.get('/', authenticate, asyncHandler(followController.listFollows));

export default router;
