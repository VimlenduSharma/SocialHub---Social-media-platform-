/* ────────────────────────────────────────────────────────────────────────────
   Bookmark Service – all DB logic for bookmarks
   Location : backend/src/services/bookmark.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                              Shared SELECT                                 */
/* -------------------------------------------------------------------------- */

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;

const POST_SELECT = {
  id: true,
  content: true,
  imageUrls: true,
  likeCount: true,
  privacy: true,
  createdAt: true,
  author: { select: USER_SELECT },
} as const;

/* -------------------------------------------------------------------------- */
/*                                Toggle                                      */
/* -------------------------------------------------------------------------- */

/**
 *  Toggle bookmark for a (userId, postId) pair.
 *  Returns `true` if bookmarked **after** the call, otherwise `false`.
 */
export const toggle = async (userId: string, postId: string) => {
  // 1. Make sure the post exists
  const exists = await prisma.post.count({ where: { id: postId } });
  if (!exists) throw new AppError(404, 'Post not found');

  // 2. Check current state
  const row = await prisma.bookmark.findFirst({
    where: { userId, postId },
  });

  if (row) {
    await prisma.bookmark.delete({ where: { id: row.id } });
    return false; // now un-bookmarked
  }

  await prisma.bookmark.create({ data: { userId, postId } });
  return true; // now bookmarked
};

/* -------------------------------------------------------------------------- */
/*                            List bookmarks                                  */
/* -------------------------------------------------------------------------- */

interface ListOptions {
  userId: string;
  take: number;             // 1 – 50
  cursor?: string;          // ISO timestamp
}

export const list = async ({ userId, take, cursor }: ListOptions) => {
  const where: Record<string, any> = { userId };
  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const bookmarks = await prisma.bookmark.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    include: { post: { select: POST_SELECT } },
  });

  let nextCursor: string | undefined;
  if (bookmarks.length > take) {
    const next = bookmarks.pop();
    nextCursor = next!.createdAt.toISOString();
  }

  const posts = bookmarks.map((b) => ({
    bookmarkId: b.id,
    ...b.post,
  }));

  return { posts, nextCursor };
};
