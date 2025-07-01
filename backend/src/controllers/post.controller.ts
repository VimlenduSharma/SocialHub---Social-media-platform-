import type { Request, Response } from 'express';

import * as postService from '@/services/post.service';
import { AppError } from '@/utils/AppError';
import { createPostSchema, feedQuerySchema } from '@/utils/validators';


export const createPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const body = createPostSchema.parse(req.body);

  const post = await postService.createPost({ authorId: req.user.uid, content: body.content.trim(), imageUrls: body.imageUrls ?? [], privacy: body.privacy, });

  return res.status(201).json(post);
};

export const listFeed = async (req: Request, res: Response) => {
  // 1. Validate & parse query
  const { limit, cursor, tab } = feedQuerySchema.parse(req.query);
  const take = Math.min(Math.max(parseInt(limit ?? '20', 10) || 20, 1), 50);

  // 2. Delegate all DB logic (including following-tab filtering, pagination) into the service
  const { posts, nextCursor } = await postService.listFeed({
    tab,
    take,
    cursor,
    currentUser: req.user?.uid ?? null,
  });

  // 3. Return
  return res.json({ posts, nextCursor });
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await postService.getPostWithComments(id);

  if (!post) throw new AppError(404, 'Post not found');

  return res.json(post);
};

export const likePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id } = req.params;

  const likeCount = await postService.clapPost(id, req.user.uid); return res.json({ likeCount });
};
