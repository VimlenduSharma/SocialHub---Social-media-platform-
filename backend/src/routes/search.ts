import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as searchController from '@/controllers/search.controller';

const router = Router();

/**
 *  GET /api/search?q=term&type={posts|users|tags}&limit=20&cursor=ISO_TIME
 *  • auth optional → follow-feed filtering not needed here
 */
router.get('/', authenticate, asyncHandler(searchController.globalSearch));

export default router;
