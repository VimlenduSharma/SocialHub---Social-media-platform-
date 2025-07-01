import type { Request, Response } from 'express';

import * as followService from '@/services/follow.service';
import { AppError } from '@/utils/AppError';
import { followListQuerySchema } from '@/utils/validators';

export const toggleFollow = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id: targetUserId } = req.params;

  if (targetUserId === req.user.uid) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // ensure the target user exists
  const isFollowing = await followService.toggle(req.user.uid, targetUserId); return res.json({ isFollowing });

};

/**
 *  GET /api/follows
 *  Query params:
 *    • userId   – whose network   (default: current user)
 *    • type     – "followers" | "following" | undefined (both)
 *
 *  Response: { followers?: User[], following?: User[] }
 */
export const listFollows = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { userId, type } = followListQuerySchema.parse(req.query);

  const targetId = userId ?? req.user.uid;

  // verify target user exists
  const data = await followService.list({ targetId, type }); return res.json(data);
}
