// File: backend/src/controllers/comment.controller.ts

import type { Request, Response } from 'express';
import * as commentService from '@/services/comment.service';
import { AppError } from '@/utils/AppError';
import { createCommentSchema } from '@/utils/validators';

export const addComment = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Unauthenticated');
  }

  // 1. Validate inputs
  const { id: postId } = req.params;
  const { content } = createCommentSchema.parse(req.body);

  // 2. Delegate to service (which handles existence check + notification)
  const comment = await commentService.addComment({
    postId,
    authorId: req.user.uid,
    content,
  });

  // 3. Return the newly-created comment
  return res.status(201).json(comment);
};
