/* ─────────────────────────────────────────────────────────────────────────────
   Search Controller
   Location : backend/src/controllers/search.controller.ts
   ─────────────────────────────────────────────────────────────────────────── */

import type { Request, Response } from 'express';

import * as searchService from '@/services/search.service';
import { AppError } from '@/utils/AppError';
import { searchQuerySchema } from '@/utils/validators';


export const globalSearch = async (req: Request, res: Response) => {
  /* ── 1. Validate & sanitise query params ──────────────────────────────── */
  const { q, type, cursor, limit } = searchQuerySchema.parse(req.query);

  const take = Math.min(Math.max(parseInt(limit ?? '20', 10) || 20, 1), 50);

  /* ── 2. Decide which domains we’re searching ──────────────────────────── */
  const data = await searchService.search({ q, type, take, cursor }); return res.json(data);
};
