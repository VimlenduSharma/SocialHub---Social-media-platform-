/* ────────────────────────────────────────────────────────────────────────────
   Follow Service – central DB logic for the follow graph
   Location : backend/src/services/follow.service.ts
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

/* -------------------------------------------------------------------------- */
/*                             Toggle Follow                                  */
/* -------------------------------------------------------------------------- */

/**
 *  Toggle follow / unfollow for `(followerId ➜ followingId)`.
 *  Returns `true` if **following after** the call, `false` otherwise.
 */
export const toggle = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  // make sure the target user exists
  const exists = await prisma.user.count({ where: { id: followingId } });
  if (!exists) throw new AppError(404, 'User not found');

  // current relation?
  const row = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });

  if (row) {
    await prisma.follow.delete({ where: { id: row.id } });
    return false; // unfollowed
  }

  await prisma.follow.create({ data: { followerId, followingId } });

  // notification
  await prisma.notification.create({
    data: {
      userId: followingId,
      type:   'FOLLOW',
      payload: { fromUserId: followerId },
    },
  });

  return true; // now following
};

/* -------------------------------------------------------------------------- */
/*                               List Graph                                   */
/* -------------------------------------------------------------------------- */

interface ListOptions {
  targetId: string;                         // whose network?
  type?: 'followers' | 'following';         // filter
}

export const list = async ({ targetId, type }: ListOptions) => {
  // verify user exists
  const exists = await prisma.user.count({ where: { id: targetId } });
  if (!exists) throw new AppError(404, 'User not found');

  const result: Record<string, unknown> = {};

  if (!type || type === 'followers') {
    const followers = await prisma.follow.findMany({
      where: { followingId: targetId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        follower: { select: USER_SELECT },
      },
    });

    result.followers = followers.map((f) => ({
      followedAt: f.createdAt,
      ...f.follower,
    }));
  }

  if (!type || type === 'following') {
    const following = await prisma.follow.findMany({
      where: { followerId: targetId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        following: { select: USER_SELECT },
      },
    });

    result.following = following.map((f) => ({
      followedAt: f.createdAt,
      ...f.following,
    }));
  }

  return result;
};
