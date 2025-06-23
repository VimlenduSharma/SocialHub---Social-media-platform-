/* ─────────────────────────────────────────────────────────────────────────────
   Comment Controller
   Location : backend/src/controllers/comment.controller.ts
   ─────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';
import { z } from 'zod';

import * as commentService from '@/services/comment.service';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(1_000, 'Comment too long'),
});

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

/**
 *  POST /api/posts/:id/comment
 *  Body: { content }
 */
export const addComment = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const { id: postId } = req.params;
  const { content } = createCommentSchema.parse(req.body);

  // 1. Verify the post exists
  const { id: postId } = req.params; const { content } = createCommentSchema.parse(req.body); const comment = await commentService.addComment({ postId, authorId: req.user.uid, content, }); return res.status(201).json(comment);

  // 3. Notify the post author (unless they commented on their own post)
  if (post.authorId !== req.user.uid) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'COMMENT',
        payload: { postId, commentId: comment.id, fromUserId: req.user.uid },
      },
    });
  }

  return res.status(201).json(comment);
};
