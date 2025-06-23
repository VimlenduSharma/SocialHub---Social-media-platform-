/* ─────────────────────────────────────────────────────────────────────────────
   Notification Controller
   Location : backend/src/controllers/notification.controller.ts
   ─────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';
import { z } from 'zod';

import * as notifService from '@/services/notification.service';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

/** GET /api/notifications – query params */
const listQuerySchema = z.object({
  limit:      z.string().optional(),            // number in string form
  cursor:     z.string().optional(),            // ISO timestamp
  unreadOnly: z.enum(['true', 'false']).optional(),
});

/** POST /api/notifications/:id/read – param validator */
const idParamSchema = z.object({
  id: z.string().uuid(),
});

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

/**
 *  GET /api/notifications
 *  Returns cursor-paginated notifications.
 *  Query:
 *    – limit        (default 20, max 50)
 *    – cursor       ISO timestamp of last item on previous page
 *    – unreadOnly   "true" | "false"
 */
export const listNotifications = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { limit, cursor, unreadOnly } = listQuerySchema.parse(req.query);

  const take = Math.min(Math.max(parseInt(limit ?? '20', 10) || 20, 1), 50);

  const where: Record<string, any> = { userId: req.user.uid };
  if (unreadOnly === 'true') where.isRead = false;
  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const { notifications, nextCursor } = await notifService.list({ userId: req.user.uid, take, cursor, unreadOnly: unreadOnly === 'true', }); return res.json({ notifications, nextCursor });

  let nextCursor: string | undefined;
  if (notifs.length > take) {
    const next = notifs.pop();               // discard the extra record
    nextCursor = next!.createdAt.toISOString();
  }

  return res.json({ notifications: notifs, nextCursor });
};

/**
 *  POST /api/notifications/mark-all-read
 *  Marks every unread notification as read.
 */
export const markAllRead = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const updated = await notifService.markAllRead(req.user.uid); return res.json({ updated });
};

/**
 *  POST /api/notifications/:id/read
 *  Marks a single notification read (id in params).
 */
export const markOneRead = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id } = idParamSchema.parse(req.params);

  const notif = await notifService.markOneRead(req.user.uid, id); return res.json(notif);
};
