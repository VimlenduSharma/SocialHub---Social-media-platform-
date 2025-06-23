/* ─────────────────────────────────────────────────────────────────────────────
   Post Controller
   Location : backend/src/controllers/post.controller.ts
   ─────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';
import { z } from 'zod';

import * as postService from '@/services/post.service';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

/** POST /api/posts – body validator */
const createPostSchema = z
  .object({
    content:   z.string().max(5_000).optional().default(''),
    imageUrls: z.array(z.string().url()).max(4).optional(),
    privacy:   z.enum(['PUBLIC', 'FOLLOWERS']).optional().default('PUBLIC'),
  })
  .refine(
    (data) => data.content.trim() !== '' || (data.imageUrls?.length ?? 0) > 0,
    { message: 'Post must contain text or at least one image' }
  );

/** GET /api/posts – query validator */
const feedQuerySchema = z.object({
  limit:  z.string().optional(),
  cursor: z.string().optional(),      // ISO timestamp string
  tab:    z.enum(['ALL', 'FOLLOWING']).optional(),
});

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

/**
 *  POST /api/posts
 */
export const createPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const body = createPostSchema.parse(req.body);

  const post = await postService.createPost({ authorId: req.user.uid, content: body.content.trim(), imageUrls: body.imageUrls ?? [], privacy: body.privacy, });

  return res.status(201).json(post);
};

/**
 *  GET /api/posts   (global / following feed – cursor-based)
 */
export const listFeed = async (req: Request, res: Response) => {
  const { limit, cursor, tab } = feedQuerySchema.parse(req.query);

  const take = Math.min(Math.max(parseInt(limit ?? '20', 10) || 20, 1), 50);

  const where: Record<string, unknown> = {};

  // “Following” tab → only authors current user follows
  if (tab === 'FOLLOWING') {
    if (!req.user) throw new AppError(401, 'Login required for FOLLOWING feed');

    const following = await prisma.follow.findMany({
      where: { followerId: req.user.uid },
      select: { followingId: true },
    });
    where.authorId = { in: following.map((f) => f.followingId) };
  }

  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const { posts, nextCursor } = await postService.listFeed({ tab, take, cursor, currentUser: req.user?.uid ?? null, }); return res.json({ posts, nextCursor });

  nextCursor: string | undefined;
  if (posts.length > take) {
    const next = posts.pop(); // remove the extra item
    nextCursor = next!.createdAt.toISOString();
  }

  return res.json({ posts, nextCursor });
};

/**
 *  GET /api/posts/:id
 */
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await postService.getPostWithComments(id);

  if (!post) throw new AppError(404, 'Post not found');

  return res.json(post);
};

/**
 *  POST /api/posts/:id/like
 *  Medium-style “clap”: we simply ++likeCount.
 */
export const likePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id } = req.params;

  const likeCount = await postService.clapPost(id, req.user.uid); return res.json({ likeCount });
};
