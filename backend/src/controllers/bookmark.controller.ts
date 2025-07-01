import type { Request, Response } from 'express';
import { bookmarkListQuerySchema } from '@/utils/validators';

import * as bookmarkService from '@/services/bookmark.service';
import { AppError } from '@/utils/AppError';

export const toggleBookmark = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const postId = req.params.id;
  const isBookmarked = await bookmarkService.toggle(req.user.uid, postId);
  return res.json({ isBookmarked });
};


export const listBookmarks = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  // 1. Validate query
  const { limit, cursor } = bookmarkListQuerySchema.parse(req.query);

  // 2. Normalize limit → take
  const take = Math.min(
    Math.max(parseInt(limit ?? '20', 10) || 20, 1),
    50
  );

  // 3. Delegate to service
  const { posts, nextCursor } = await bookmarkService.list({
    userId: req.user.uid,
    take,
    cursor,
  });

  // 4. Respond
  return res.json({ posts, nextCursor });
};
