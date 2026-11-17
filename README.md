# CineReview – Premium Movie Review & Rating Platform

A full-stack, responsive, modern movie review and rating web application built with **React.js, Node.js, Express.js, MongoDB Atlas (Mongoose), TMDB API, and JWT Authentication**.

Designed with a premium cinematic dark theme featuring deep navy and pitch black tones, glowing ruby-red and royal-purple accents, fluid glassmorphism, dynamic ratings, and community reviews.

---

## 🌟 Key Features

### 1. Cinematic User Experience
- **Dark Cinematic Aesthetic**: Deep navy and black backgrounds with subtle borders, vibrant red and purple accent gradients, and custom scrollbars.
- **Hero Spotlight**: Dynamic featured movie spotlight with high-definition backdrop, meta pills, TMDB & community ratings, and direct actions.
- **Responsive Layout**: Designed for seamless viewing across smartphones, tablets, laptops, and ultra-wide desktops.
- **Animated Interactions**: Hover zoom on movie cards, rating bubbles, toast alerts, and smooth transitions.

### 2. Live Movie Data & TMDB Integration
- **Real-Time TMDB Queries**: Fetches trending, popular, top-rated, and recently released movies directly from The Movie Database (TMDB) API.
- **Smart Fallback Engine**: If a TMDB API key is not supplied or offline, CineReview seamlessly switches to an authentic curated catalog of top films with zero broken images or empty screens.
- **Deep Search & Filtering**: Real-time debounced title search, category filter by genre (Action, Sci-Fi, Drama, Comedy, etc.), and multi-mode sorting (Popularity, Rating, Release Date).

### 3. Movie Details & Dual Rating Architecture
- Dedicated movie page featuring high-res backdrop, poster, title, release date, genres, runtime, and director.
- Cast roster with actor photos and character names.
- **Dual Rating Comparison**:
  1. **TMDB Global Rating** (out of 10 with vote count).
  2. **CineReview Community Rating** (calculated dynamically from real user reviews in MongoDB).

### 4. Review & Rating System
- **Rating Selector**: Select rating from 1 to 10 with interactive hover states.
- **Review Submission**: Custom review title and in-depth thoughts with live character counter.
- **Strict Integrity Rules**: Enforces **one review per user per movie** using compound unique MongoDB index (`{ userId: 1, movieId: 1 }`).
- **Review Editing & Deletion**: Users can update or delete their own reviews at any time.
- **Community Helpful Votes**: Users can vote reviews as "Helpful" with instant live counters and multi-vote prevention.
- **Sorting**: Sort reviews by Newest First, Highest Rated, or Most Helpful.

### 5. Personal User Watchlist
- Authenticated users can save movies to their personal watchlist with a single click.
- Watchlist items persist in MongoDB with title, poster, release date, and rating.
- Dedicated `/watchlist` grid with instant removal and quick links to details.

### 6. User Profile
- Displays user avatar, full name, email, member since date, and critic statistics.
- Interactive profile editor: update name, select from cinematic avatar presets or supply custom image URLs, and update password.
- View and manage all personal submitted reviews with direct links to edit/delete.

### 7. Protected Admin Dashboard (`/admin`)
- Accessible only to authenticated users with `role: 'admin'`.
- Real-time platform metrics:
  - Total registered users
  - Total community reviews
  - Total movies cached
  - Average platform rating
- **Review Moderation**: View all community reviews across the platform and delete inappropriate or abusive submissions.
- **User Management**: View user directory and manage accounts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React, Modern CSS3 |
| **Backend** | Node.js, Express.js, REST APIs, Morgan |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js password hashing |
| **External API** | The Movie Database (TMDB) v3 API with curated fallback |

---

## 📁 Project Structure

```text
moviereview/
├── backend/
│   ├── config/
│   │   ├── db.js                   # Mongoose MongoDB connection & status
│   │   └── tmdb.js                 # TMDB v3 API client & curated fallback
│   ├── controllers/
│   │   ├── authController.js       # Register, login, get current user
│   │   ├── movieController.js      # Discover, search, details, genres, rows
│   │   ├── reviewController.js     # Add, edit, delete reviews & helpful votes
│   │   ├── watchlistController.js  # Add, remove, view user watchlist
│   │   ├── userController.js       # User profile & personal stats
│   │   └── adminController.js      # Platform stats & admin moderation
│   ├── middleware/
│   │   ├── authMiddleware.js       # Bearer JWT verification
│   │   ├── adminMiddleware.js      # Role-based admin authorization check
│   │   └── errorMiddleware.js      # Centralized error handling & 404
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt pre-save
│   │   ├── Movie.js                # Cached movie schema & community stats
│   │   ├── Review.js               # Review schema with compound unique index
│   │   └── Watchlist.js            # User personal watchlist schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── watchlistRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js        # JWT generation helper
│   │   ├── tmdbFallbackData.js     # Curated authentic dataset
│   │   └── seedAdmin.js            # Admin seeder CLI utility
│   ├── server.js                   # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Glassmorphic navbar with search & drawer
│   │   │   ├── Footer.jsx          # Footer with links & TMDB attribution
│   │   │   ├── Hero.jsx            # Dynamic spotlight banner
│   │   │   ├── MovieCard.jsx       # Card with poster, year, rating & watchlist
│   │   │   ├── RatingBadge.jsx     # Gold/amber star badge with score
│   │   │   ├── ReviewForm.jsx      # Rating selector (1-10) & text form
│   │   │   ├── ReviewCard.jsx      # Reviewer card with helpful vote & edit
│   │   │   ├── ReviewList.jsx      # Sorted list of reviews
│   │   │   ├── ProtectedRoute.jsx  # Route guard for authenticated users
│   │   │   └── Loader.jsx          # Cinematic spinner
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global user & JWT state
│   │   │   ├── WatchlistContext.jsx# User watchlist synchronization
│   │   │   └── ToastContext.jsx    # Pop-up notification alerts
│   │   ├── hooks/
│   │   │   └── useDebounce.js      # Debounced search hook
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Hero, trending, popular, top rated
│   │   │   ├── MoviesPage.jsx      # Live search, genre filtering & sorting
│   │   │   ├── MovieDetailsPage.jsx# Details, cast, dual ratings & reviews
│   │   │   ├── WatchlistPage.jsx   # Personal saved movies grid
│   │   │   ├── ProfilePage.jsx     # Profile management & review history
│   │   │   ├── AdminDashboardPage.jsx# Moderation & platform metrics
│   │   │   ├── LoginPage.jsx       # Sign in with 1-click demo fill
│   │   │   ├── RegisterPage.jsx    # Account registration
│   │   │   └── NotFoundPage.jsx    # 404 cinematic error page
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with auth interceptor
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── reviewService.js
│   │   │   ├── watchlistService.js
│   │   │   └── adminService.js
│   │   ├── styles/
│   │   │   └── index.css           # Cinematic CSS design system
│   │   ├── App.jsx                 # Router & route definitions
│   │   └── main.jsx                # React root mount
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env
│
├── package.json                    # Root npm scripts
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Run Instructions

### 1. Prerequisites
- **Node.js** v18+ (installed: v22.19.0)
- **MongoDB**: Either local MongoDB (`mongodb://127.0.0.1:27017/cinereview`) or a free [MongoDB Atlas Cluster](https://www.mongodb.com/atlas).

### 2. Environment Configuration

Check `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cinereview
JWT_SECRET=cinereview_super_secret_jwt_key_2025_secure
TMDB_API_KEY=
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Note on TMDB API Key**:
> You can obtain a free API key from [themoviedb.org](https://www.themoviedb.org/settings/api). If you leave `TMDB_API_KEY` blank, the platform automatically activates its built-in curated catalog, so every page and feature works immediately!

### 3. Seed Default Administrator (Optional)
Run from the root or inside `backend/`:
```bash
npm --prefix backend run seed:admin
```
This sets up the default administrator account:
- **Email**: `admin@cinereview.com`
- **Password**: `Admin@123456`

### 4. Run the Development Servers

Open two terminal tabs:

**Terminal 1 (Backend API Server):**
```bash
npm --prefix backend run dev
# Or: node backend/server.js
```
*API runs on `http://localhost:5000`*

**Terminal 2 (Frontend Client):**
```bash
npm --prefix frontend run dev
```
*Vite dev server opens at `http://localhost:5173`*

---

## 🔑 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | Public | Register new user account |
| **POST** | `/api/auth/login` | Public | Login & receive JWT |
| **GET** | `/api/auth/me` | Private | Get authenticated user info |
| **GET** | `/api/movies` | Public | Discover movies with genre & sorting |
| **GET** | `/api/movies/trending` | Public | Get weekly trending movies |
| **GET** | `/api/movies/popular` | Public | Get popular movies |
| **GET** | `/api/movies/top-rated` | Public | Get top-rated movies |
| **GET** | `/api/movies/now-playing` | Public | Get recently released movies |
| **GET** | `/api/movies/genres` | Public | Get genre listing |
| **GET** | `/api/movies/search` | Public | Search movies by title |
| **GET** | `/api/movies/:id` | Public | Get movie details, cast, director & ratings |
| **GET** | `/api/reviews/:movieId` | Public | Get reviews for a movie (sortable) |
| **POST** | `/api/reviews` | Private | Submit a review (rating 1-10, title, text) |
| **PUT** | `/api/reviews/:id` | Private | Update own review |
| **DELETE** | `/api/reviews/:id` | Private | Delete own review |
| **POST** | `/api/reviews/:id/helpful` | Private | Toggle helpful vote on a review |
| **GET** | `/api/watchlist` | Private | Get user's saved movies |
| **POST** | `/api/watchlist/:movieId` | Private | Add movie to user's watchlist |
| **DELETE** | `/api/watchlist/:movieId` | Private | Remove movie from user's watchlist |
| **GET** | `/api/watchlist/check/:id`| Private | Check if movie is saved in watchlist |
| **GET** | `/api/users/profile` | Private | Get user profile, statistics & review history |
| **PUT** | `/api/users/profile` | Private | Update user name, avatar or password |
| **GET** | `/api/admin/dashboard` | Admin | Get metrics (users, reviews, platform rating) |
| **GET** | `/api/admin/reviews` | Admin | View all reviews across platform |
| **DELETE** | `/api/admin/reviews/:id` | Admin | Moderate / delete inappropriate review |
| **GET** | `/api/admin/users` | Admin | List all registered users |
| **DELETE** | `/api/admin/users/:id` | Admin | Delete a user account and their reviews |
