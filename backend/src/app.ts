// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postsRoute from '@/routes/posts';
import { errorHandler } from '@/middlewares/errorHandler';
import usersRoute from '@/routes/users';
import bookmarksRoute from '@/routes/bookmarks';
import followsRoute from '@/routes/follows';
import notificationsRoute from '@/routes/notifications';
import searchRoute from '@/routes/search';
import uploadsRoute from '@/routes/uploads'; 
import commentsRoute from '@/routes/comments';
import { httpLogger } from '@/utils/logger';
const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookmarks', bookmarksRoute);
app.use('/api/follows', followsRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/search', searchRoute);
app.use('/api/uploads', uploadsRoute);
app.use('/api/comments', commentsRoute); 
app.use(httpLogger);

app.get('/', (_req, res) => {
  res.send('SocialHub API is running 🚀');
});
/* ─── Global error middleware MUST come after all routes ──────────────── */
app.use(errorHandler);

export default app;
