/* ────────────────────────────────────────────────────────────────────────────
   Post Service  –  all DB logic for the “post” domain
   Location : backend/src/services/post.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import { prisma } from '@/config/database';
import type { Prisma } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/*                           Shared SELECT blocks                             */
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
/*                                 Create                                     */
/* -------------------------------------------------------------------------- */

interface CreatePostDTO {
  authorId:  string;
  content:   string;
  imageUrls: string[];
  privacy:   'PUBLIC' | 'FOLLOWERS';
}

export const createPost = (dto: CreatePostDTO) =>
  prisma.post.create({
    data: dto,
    select: POST_SELECT,
  });

/* -------------------------------------------------------------------------- */
/*                                 Feed                                       */
/* -------------------------------------------------------------------------- */

interface FeedOptions {
  tab:          'ALL' | 'FOLLOWING';
  take:         number;              // 1 – 50
  cursor?:      string;              // ISO timestamp
  currentUser?: string | null;       // uid OR null
}

export const listFeed = async ({
  tab,
  take,
  cursor,
  currentUser,
}: FeedOptions) => {
  const where: Prisma.PostWhereInput = {};

  if (tab === 'FOLLOWING') {
    if (!currentUser) throw new Error('FOLLOWING feed requires auth');

    const following = await prisma.follow.findMany({
      where: { followerId: currentUser },
      select: { followingId: true },
    });
    where.authorId = { in: following.map((f) => f.followingId) };
  }

  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    select: POST_SELECT,
  });

  let nextCursor: string | undefined;
  if (posts.length > take) {
    const next = posts.pop();
    nextCursor = next!.createdAt.toISOString();
  }

  return { posts, nextCursor };
};

/* -------------------------------------------------------------------------- */
/*                           Single-post fetch                                */
/* -------------------------------------------------------------------------- */

export const getPostWithComments = (id: string) =>
  prisma.post.findUnique({
    where: { id },
    select: {
      ...POST_SELECT,
      comments: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: USER_SELECT },
        },
      },
    },
  });

/* -------------------------------------------------------------------------- */
/*                                “Clap”                                      */
/* -------------------------------------------------------------------------- */

export const clapPost = async (postId: string, likerId: string) => {
  // 1. ++likeCount
  const post = await prisma.post.update({
    where: { id: postId },
    data:  { likeCount: { increment: 1 } },
    select: { likeCount: true, authorId: true },
  });

  // 2. Notify author (skip self-likes)
  if (post.authorId !== likerId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type:   'LIKE',
        payload: { postId, fromUserId: likerId },
      },
    });
  }

  return post.likeCount;
};
