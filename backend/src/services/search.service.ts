import { prisma } from '@/config/database';
import type { Prisma } from '@prisma/client';



const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

const POST_SELECT = {
  id: true,
  content: true,
  imageUrls: true,
  likeCount: true,
  privacy: true,
  createdAt: true,
  author: { select: USER_SELECT },
} satisfies Prisma.PostSelect;


export interface SearchOptions {
  q: string;
  type?: 'posts' | 'users' | 'tags';
  take: number;     // 1–50
  cursor?: string;  // ISO timestamp
}


export const search = async ({
  q,
  type,
  take,
  cursor,
}: SearchOptions): Promise<Record<string, unknown>> => {
  const wantPosts = !type || type === 'posts';
  const wantUsers = !type || type === 'users';
  const wantTags  = type === 'tags';

  const result: Record<string, unknown> = {};
  let nextCursor: string | undefined;

  /* ───────────── Posts ───────────── */
  if (wantPosts) {
    const where: Prisma.PostWhereInput = {
      content: { contains: q, mode: 'insensitive' },
      ...(cursor && { createdAt: { lt: new Date(cursor) } }),
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      select: POST_SELECT,
    });

    if (posts.length > take) {
      const next = posts.pop()!;
      nextCursor = next.createdAt.toISOString();
    }

    result.posts = posts;
  }

  /* ───────────── Users ───────────── */
  if (wantUsers) {
    const where: Prisma.UserWhereInput = {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { name:     { contains: q, mode: 'insensitive' } },
      ],
      ...(!wantPosts && cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    };

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      select: USER_SELECT,
    });

    if (!wantPosts && users.length > take) {
      const next = users.pop()!;
      nextCursor = next.createdAt.toISOString();
    }

    result.users = users;
  }

  /* ───────────── Tags ────────────── */
  if (wantTags) {
    // Raw SQL → distinct hashtags containing the query
    const tagsQuery = await prisma.$queryRaw<{ tag: string }[]>`
      SELECT DISTINCT LOWER(REPLACE(match, '#', '')) AS tag
      FROM (
        SELECT unnest(regexp_matches(content, '#[^\\s#]+', 'g')) AS match
        FROM "Post"
      ) t
      WHERE match ILIKE '%' || ${`#${q}`} || '%'
      LIMIT ${take}
    `;

    result.tags = tagsQuery.map(t => t.tag);
  }

  if (nextCursor) result.nextCursor = nextCursor;
  return result;
};
