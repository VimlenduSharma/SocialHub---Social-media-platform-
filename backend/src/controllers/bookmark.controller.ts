import type { Request, Response } from 'express';
import { z } from 'zod';

import * as bookmarkService from '@/services/bookmark.service';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

const listQuerySchema = z.object({
  limit:  z.string().optional(),     // number → parsed below
  cursor: z.string().optional(),     // ISO date string
});

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

/**
 *  POST /api/posts/:id/bookmark
 *  Toggles bookmark  ➜  returns { isBookmarked: boolean }
 */
export const toggleBookmark = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id: postId } = req.params;

  // Ensure the post exists
  const isBookmarked = await bookmarkService.toggle(req.user.uid, postId); return res.json({ isBookmarked });

/**
 *  GET /api/bookmarks            (cursor–paginated)
 *  Response: { posts, nextCursor? }
 */
export const listBookmarks = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { limit, cursor } = listQuerySchema.parse(req.query);
  const { posts, nextCursor } = await bookmarkService.list({ userId: req.user.uid, take, cursor }); return res.json({ posts, nextCursor });

  

  let nextCursor: string | undefined;
  if (bookmarks.length > take) {
    const next = bookmarks.pop(); // discard the extra record
    nextCursor = next!.createdAt.toISOString();
  }

  // Flatten → return array of posts (with bookmarkId if you need it)
  const posts = bookmarks.map((b) => ({
    bookmarkId: b.id,
    ...b.post,
  }));

  return res.json({ posts, nextCursor });
};
