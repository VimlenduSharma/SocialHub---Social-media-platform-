/* ────────────────────────────────────────────────────────────────────────────
   Notification Service – all DB logic for notifications
   Location : backend/src/services/notification.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               SELECT block                                */
/* -------------------------------------------------------------------------- */

const NOTIF_SELECT = {
  id: true,
  type: true,
  payload: true,
  isRead: true,
  createdAt: true,
} as const;

/* -------------------------------------------------------------------------- */
/*                                List                                        */
/* -------------------------------------------------------------------------- */

interface ListOptions {
  userId: string;
  take: number;            // 1 – 50
  cursor?: string;         // ISO timestamp
  unreadOnly?: boolean;
}

export const list = async ({
  userId,
  take,
  cursor,
  unreadOnly,
}: ListOptions) => {
  const where: Record<string, any> = { userId };
  if (unreadOnly) where.isRead = false;
  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    select: NOTIF_SELECT,
  });

  let nextCursor: string | undefined;
  if (notifications.length > take) {
    const next = notifications.pop();
    nextCursor = next!.createdAt.toISOString();
  }

  return { notifications, nextCursor };
};

/* -------------------------------------------------------------------------- */
/*                           Mark-all-read                                    */
/* -------------------------------------------------------------------------- */

export const markAllRead = async (userId: string) => {
  const { count } = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data:  { isRead: true },
  });
  return count; // number of rows updated
};

/* -------------------------------------------------------------------------- */
/*                         Mark a single read                                 */
/* -------------------------------------------------------------------------- */

export const markOneRead = async (userId: string, id: string) => {
  try {
    // requires @@unique([id, userId]) in Notification model
    return await prisma.notification.update({
      where: { id_userId: { id, userId } },
      data:  { isRead: true },
      select: { id: true, isRead: true },
    });
  } catch (err: any) {
    if (err?.code === 'P2025') throw new AppError(404, 'Notification not found');
    throw err;
  }
};
