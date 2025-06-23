/* ────────────────────────────────────────────────────────────────────────────
   User Controller
   Location : backend/src/controllers/user.controller.ts
   ────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';
import { z } from 'zod';

import * as userService from '@/services/user.service';
import { AppError } from '@/utils/AppError';

/* -------------------------------------------------------------------------- */
/*                               Validators                                   */
/* -------------------------------------------------------------------------- */

const updateProfileSchema = z
  .object({
    name:       z.string().min(2).max(60).optional(),
    username:   z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
    bio:        z.string().max(160).optional().nullable(),
    avatarUrl:  z.string().url().optional().nullable(),
    coverUrl:   z.string().url().optional().nullable(),
    location:   z.string().max(100).optional().nullable(),
    website:    z.string().url().optional().nullable(),
  })
  .strict();

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

/**
 *  GET /api/users/me
 *  Returns the authenticated user’s profile.
 */
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const user = await userService.getUserById(req.user.uid, { id: true, username: true, name: true, email: true, bio: true, avatarUrl: true, coverUrl: true, location: true, website: true, createdAt: true, });

  if (!user) throw new AppError(404, 'User not found');

  return res.json(user);
};

/**
 *  PUT /api/users/me
 *  Updates the authenticated user’s profile.
 */
export const updateMe = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthenticated');

  const data = updateProfileSchema.parse(req.body);

  try {
    const updated = await userService.updateUserById(req.user.uid, data);

    return res.json(updated);
  } catch (err: any) {
    // Handle “username/email already taken” nicely
    if (err?.code === 'P2002') {
      throw new AppError(400, `Field '${err.meta?.target}' is already in use`);
    }
    throw err; // bubble up to errorHandler
  }
};

/**
 *  GET /api/users/:username
 *  Public profile lookup.
 */
export const getByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await userService.getPublicProfileByUsername(username);

  if (!user) throw new AppError(404, 'User not found');

  return res.json(user);
};
