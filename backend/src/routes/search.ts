import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { asyncHandler } from '@/middlewares/asyncHandler';
import * as searchController from '@/controllers/search.controller';

const router = Router();


router.get('/', authenticate, asyncHandler(searchController.globalSearch));

export default router;
