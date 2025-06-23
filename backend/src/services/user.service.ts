/* ────────────────────────────────────────────────────────────────────────────
   User Service – all DB access for the “user” domain in one place
   Location : backend/src/services/user.service.ts
   ────────────────────────────────────────────────────────────────────────── */

import { prisma } from '@/config/database';
import type { Prisma } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/*                                Getters                                     */
/* -------------------------------------------------------------------------- */

/** Fetch any user by primary ID (Firebase UID) */
export const getUserById = (
  id: string,
  select?: Prisma.UserSelect
) =>
  prisma.user.findUnique({
    where: { id },
    select,
  });

/** Fetch a public profile by `username` */
export const getPublicProfileByUsername = (username: string) =>
  prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      location: true,
      website: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });

/* -------------------------------------------------------------------------- */
/*                                Updates                                     */
/* -------------------------------------------------------------------------- */

/** Update any user (by ID) and return the fields a client needs */
export const updateUserById = (
  id: string,
  data: Prisma.UserUpdateInput
) =>
  prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      location: true,
      website: true,
      updatedAt: true,
    },
  });
