import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name:      z.string().min(2).max(60).optional(),
    username:  z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
    bio:       z.string().max(160).optional().nullable(),
    avatarUrl: z.string().url().optional().nullable(),
    coverUrl:  z.string().url().optional().nullable(),
    location:  z.string().max(100).optional().nullable(),
    website:   z.string().url().optional().nullable(),
  })
  .strict();

export const createPostSchema = z
  .object({
    content:   z.string().max(5000).optional().default(''),
    imageUrls: z.array(z.string().url()).max(4).optional(),
    privacy:   z.enum(['PUBLIC', 'FOLLOWERS']).optional().default('PUBLIC'),
  })
  .refine(
    (data) => data.content.trim() !== '' || (data.imageUrls?.length ?? 0) > 0,
    { message: 'Post must contain text or at least one image' }
  );

export const feedQuerySchema = z.object({
  limit:  z.string().optional(),
  cursor: z.string().optional(),         // ISO timestamp
  tab:    z.enum(['ALL', 'FOLLOWING']).optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment too long'),
});

export const bookmarkListQuerySchema = z.object({
  limit:  z.string().optional(),
  cursor: z.string().optional(),
});

//
// ─── FOLLOWS ─────────────────────────────────────────────────────────────────
//

export const followListQuerySchema = z.object({
  userId: z.string().optional(),
  type:   z.enum(['followers', 'following']).optional(),
});

//
// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
//

export const notificationListQuerySchema = z.object({
  limit:      z.string().optional(),
  cursor:     z.string().optional(),
  unreadOnly: z.enum(['true', 'false']).optional(),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid(),
});

//
// ─── SEARCH ──────────────────────────────────────────────────────────────────
//

export const searchQuerySchema = z.object({
  q:      z.string().trim().min(1).max(100),
  type:   z.enum(['posts', 'users', 'tags']).optional(),
  limit:  z.string().optional(),
  cursor: z.string().optional(),
});

//
// ─── UPLOADS ─────────────────────────────────────────────────────────────────
//

export const uploadImagesQuerySchema = z
  .object({
    folder: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || /^[a-zA-Z0-9/_-]+$/.test(val),
        'folder may only contain letters, numbers, /, _ or -'
      ),
  })
  .strict();

export const uploadDeleteParamsSchema = z.object({
  publicId: z.string().min(1),
});
