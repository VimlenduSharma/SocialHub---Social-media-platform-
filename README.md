# SocialHub

A simplified full-stack social media platform where users can interact through posts, likes, comments, bookmarks, follows, and real-time notifications with image support.

## Project Setup Instructions

1. **Clone the repository**

   ```bash
   https://github.com/VimlenduSharma/SocialHub---Social-media-platform-.git
   cd socialhub
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   # Create a .env file with the required variables (see .env.example)
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Access the App**

   * Frontend: [https://social-hub-social-media-platform-p3xayxz6y.vercel.app](https://social-hub-social-media-platform-p3xayxz6y.vercel.app)
   * Backend API: [http://localhost:4000](http://localhost:4000)

## Technologies Used

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, React Query, Zustand
* **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (Supabase)
* **Authentication:** Firebase Auth & Firebase Admin SDK
* **Image Storage:** Cloudinary
* **Notifications & Real-time Updates:** Prisma notifications + polling/webhooks

## Key Features Implemented

* **User Authentication:** Secure signup & login via Firebase Auth
* **Profiles:** CRUD user profiles with avatar & cover uploads
* **Posts:** Create text/image posts with privacy settings
* **Reactions:** Medium-style claps (increment-only like count)
* **Comments:** Flat comment threads with author notifications
* **Bookmarks:** Save & list favorite posts
* **Follows:** Follow/unfollow users with relationship listings
* **Notifications:** Real-time alerts for likes, comments, follows
* **Search:** Full-text search for users, posts, and hashtags
* **Image Uploads:** Direct uploads via Cloudinary, with deletion support

## Limitations & Known Issues

* **No Unlike:** Only increments like count; unliking is not supported
* **Flat Comments:** No nested/threaded comment structure
* **No WebSocket:** Real-time notifications use polling; no WebSocket integration
* **Limited Validation:** Minimal spam or content moderation
* **No Unit Tests:** Lacks automated tests; manual testing required
* **Basic UI:** Focused on functionality; UI/UX can be enhanced further

---

*For more details, refer to the code documentation and inline comments.*
