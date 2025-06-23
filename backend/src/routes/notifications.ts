import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as notifController from '@/controllers/notification.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  asyncHandler(notifController.listNotifications)
);

router.post(
  '/mark-all-read',
  authenticate,
  asyncHandler(notifController.markAllRead)
);

router.post(
  '/:id/read',
  authenticate,
  asyncHandler(notifController.markOneRead)
);

export default router;
