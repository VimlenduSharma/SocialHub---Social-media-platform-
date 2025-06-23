/* ────────────────────────────────────────────────────────────────────────────
   Comment Service – central DB layer for comments
   Location : backend/src/services/comment.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                                 Types                                      */
/* -------------------------------------------------------------------------- */

interface AddCommentDTO {
  postId:   string;
  authorId: string;
  content:  string;
}

/* -------------------------------------------------------------------------- */
/*                               Constants                                    */
/* -------------------------------------------------------------------------- */

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;

/* -------------------------------------------------------------------------- */
/*                               Services                                     */
/* -------------------------------------------------------------------------- */

/**
 *  Create a comment, notify the post author, and return the newly
 *  created comment with the author sub-object.
 */
export const addComment = async ({
  postId,
  authorId,
  content,
}: AddCommentDTO) => {
  /* 1. Verify the post exists and get its author */
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!post) throw new AppError(404, 'Post not found');

  /* 2. Create the comment */
  const comment = await prisma.comment.create({
    data: { postId, authorId, content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: USER_SELECT },
    },
  });

  /* 3. Notify the post author (skip if they commented on their own post) */
  if (post.authorId !== authorId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type:   'COMMENT',
        payload: { postId, commentId: comment.id, fromUserId: authorId },
      },
    });
  }

  return comment;
};
