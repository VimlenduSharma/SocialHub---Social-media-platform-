import type { Request, Response } from 'express';
import * as notifService from '@/services/notification.service';
import { AppError } from '@/utils/AppError';
import {
  notificationListQuerySchema,
  notificationIdParamSchema,
} from '@/utils/validators';

export const listNotifications = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Unauthenticated');
  }

  // 1. Validate query params
  const { limit, cursor, unreadOnly } = notificationListQuerySchema.parse(
    req.query
  );

  // 2. Normalize limit → take
  const take = Math.min(
    Math.max(parseInt(limit ?? '20', 10) || 20, 1),
    50
  );

  // 3. Delegate to service
  const { notifications, nextCursor } = await notifService.list({
    userId: req.user.uid,
    take,
    cursor,
    unreadOnly: unreadOnly === 'true',
  });

  // 4. Return
  return res.json({ notifications, nextCursor });
};

export const markAllRead = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Unauthenticated');
  }

  const updated = await notifService.markAllRead(req.user.uid);
  return res.json({ updated });
};
export const markOneRead = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Unauthenticated');
  }

  // 1. Validate path param
  const { id } = notificationIdParamSchema.parse(req.params);

  // 2. Delegate to service
  const notif = await notifService.markOneRead(req.user.uid, id);

  // 3. Return
  return res.json(notif);
};
