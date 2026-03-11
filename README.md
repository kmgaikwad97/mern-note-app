# DevBlog — MERN Stack Auth App

Full-stack MERN application with JWT + Refresh Token auth, RBAC, Material UI, blog content, and personal notes CRUD.

---

## ⚡ Quick Start (3 commands)

```bash
# 1. Install all dependencies (root + backend + frontend) and create .env
npm run setup

# 2. Edit your MongoDB URI (ONLY thing you need to change)
# Open: backend/.env
# Change: MONGO_URI=mongodb://localhost:27017/devblog
# (or use a MongoDB Atlas URI)

# 3. Run both frontend and backend simultaneously
npm run dev
```

That's it. Visit **http://localhost:5173**

---

## 📋 All Root Commands

| Command | What it does |
|---------|-------------|
| `npm run setup` | Installs all deps + creates `backend/.env` from `.env.example` |
| `npm run dev` | Runs backend (port 5100) + frontend (port 5173) with concurrently |
| `npm run install:all` | Just installs all dependencies |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |

---

## 📁 Folder Structure

```
mern-auth-app/
├── package.json              ← Root: concurrently + setup scripts
├── .gitignore                ← Covers all node_modules, .env files
│
├── backend/
│   ├── .env.example          ← Template (auto-copied to .env by setup)
│   ├── .env                  ← Your config (edit MONGO_URI here)
│   ├── server.js             ← Express entry point
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js   ← register, login, refresh, logout, me
│   │   ├── blogController.js   ← 6 dummy articles (preview + full)
│   │   └── noteController.js   ← Full CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js   ← JWT protect()
│   │   ├── roleMiddleware.js   ← requireRole("user","admin")
│   │   └── errorMiddleware.js  ← Global error handler
│   ├── models/
│   │   ├── User.js             ← bcrypt pre-save, toJSON strips secrets
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   └── noteRoutes.js
│   └── utils/
│       ├── tokenUtils.js       ← JWT helpers + cookie options
│       └── responseUtils.js    ← Standardized { success, message, data }
│
└── frontend/
    ├── src/
    │   ├── theme/theme.js       ← MUI custom theme
    │   ├── api/axiosInstance.js ← Axios + silent token refresh interceptor
    │   ├── context/AuthContext.jsx ← Global auth state + persistent login
    │   ├── components/
    │   │   ├── Navbar.jsx       ← Responsive AppBar + mobile Drawer
    │   │   ├── BlogCard.jsx     ← MUI Card with hover effects
    │   │   └── AuthModal.jsx    ← MUI Dialog "Login to continue"
    │   └── pages/
    │       ├── GuestPage.jsx    ← Landing, hero, previews, scroll modal
    │       ├── LoginPage.jsx    ← Split-panel MUI form
    │       ├── RegisterPage.jsx
    │       ├── BlogsPage.jsx    ← Protected blog listing
    │       ├── BlogDetailPage.jsx ← Full article
    │       └── NotesPage.jsx    ← CRUD with MUI Dialog + Card grid
    └── package.json
```

---

## 🔑 Environment Variables (backend/.env)

The `npm run setup` command creates this file automatically. You only need to change `MONGO_URI`.

```env
PORT=5100
MONGO_URI=mongodb://localhost:27017/devblog   # ← Change this
ACCESS_TOKEN_SECRET=devblog_access_secret_change_in_prod_min_32_chars
REFRESH_TOKEN_SECRET=devblog_refresh_secret_change_in_prod_min_32_chars
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Route | Auth Required | Description |
|--------|-------|--------------|-------------|
| POST | `/register` | None | Create account |
| POST | `/login` | None | Login, returns accessToken + sets cookie |
| POST | `/refresh` | httpOnly Cookie | Get new accessToken |
| POST | `/logout` | httpOnly Cookie | Clear session |
| GET | `/me` | Bearer Token | Get current user |

### Blogs — `/api/blogs`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | None | Preview cards (no fullContent) |
| GET | `/:id` | Bearer | Full blog article |

### Notes — `/api/notes`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Bearer + role:user | Get my notes |
| POST | `/` | Bearer + role:user | Create note |
| GET | `/:id` | Bearer + role:user | Get one note |
| PUT | `/:id` | Bearer + role:user | Update note |
| DELETE | `/:id` | Bearer + role:user | Delete note |

**Response format:** `{ success: true, message: "...", data: { ... } }`

---

## 🔐 Auth Flow

```
Register/Login → accessToken (memory) + refreshToken (httpOnly cookie)
    ↓
Request with Bearer token → 401 if expired
    ↓ (Axios interceptor catches automatically)
POST /auth/refresh (cookie sent by browser) → new accessToken
    ↓
Retry original request — user never knows this happened
```

**Page refresh:** AuthContext calls `/auth/refresh` on mount → restores session silently.

**Logout:** Clears cookie + nulls refreshToken in MongoDB.

---

## 👥 RBAC

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| Landing page | ✅ | ✅ | ✅ |
| Blog previews | ✅ | ✅ | ✅ |
| Full articles | ❌ Modal | ✅ | ✅ |
| Notes CRUD | ❌ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ✅ future |

---

## 🔮 Future Improvements

- [ ] Rate limiting on auth routes (`express-rate-limit`)
- [ ] Refresh token rotation (new refresh token on each refresh)
- [ ] Email verification + password reset
- [ ] MongoDB Blog model (replace static data)
- [ ] Note search + tags
- [ ] Rich text editor (TipTap)
- [ ] Redis for token blacklist
- [ ] Admin dashboard
- [ ] Jest + Supertest unit tests
- [ ] Docker + docker-compose
- [ ] Deploy: Railway (backend) + Vercel (frontend)
