# User Management System

A full-stack user management application built with Django REST Framework and React. Features JWT authentication, role-based access control, MongoDB persistence via PyMongo, and a matte black monochrome dashboard UI with an interactive dot-matrix canvas background.

---

## Tech Stack

### Backend
- **Python / Django** — web framework
- **Django REST Framework** — REST API layer
- **PyMongo** — MongoDB driver (no ORM)
- **MongoDB** — database
- **djangorestframework-simplejwt** — JWT authentication (with custom MongoDB auth backend)
- **django-cors-headers** — cross-origin request handling

### Frontend
- **React + TypeScript** — UI framework, scaffolded with Vite
- **Axios** — HTTP client with JWT interceptor
- **TanStack Query** — server state management (queries + mutations)
- **Redux Toolkit** — client state (auth slice)
- **React Router DOM** — routing + protected routes
- **Tailwind CSS** — styling

---

## Project Structure

```
user-management-system/
  backend/
    config/             # Django project settings and root URLs
    core/               # db.py — single PyMongo connection instance
    authentication/     # Register, Login, JWT auth backend, Me endpoint
    users/              # User CRUD ViewSet + IsAdmin permission
    profiles/           # Profile view, update, image upload
    media/              # Uploaded profile images
    manage.py
  frontend/
    src/
      api/              # axiosInstance, auth.ts, users.ts, profile.ts
      app/              # Redux store + auth slice
      components/       # Layout (sidebar + main area)
      features/
        auth/           # LoginPage, RegisterPage
        users/          # UserListPage, UserDetailPage, UserEditPage, UserCreatePage
        profile/        # ProfilePage
      routes/           # AppRouter, ProtectedRoute
    index.css
    main.tsx
```

---

## Features

### Authentication
- Register with email + password (min 8 chars, unique email enforced)
- Login returns JWT access + refresh token pair
- Logout clears tokens from localStorage and Redux
- Protected routes redirect unauthenticated users to login
- Custom JWT authentication backend resolves tokens to MongoDB user documents without Django ORM

### User Management
- List all users (authenticated users)
- View user detail (authenticated users)
- Create, edit, delete users (admin only — enforced on both backend and frontend)
- Role badge displayed on list and detail views

### Profile Management
- View own profile
- Update email
- Upload profile image (multipart form, served from `/media/`)

### Role-Based Access Control
- Two roles: `user` (default) and `admin`
- Backend enforces via custom `IsAdmin` permission class on `UserViewSet`
- Frontend hides Create / Edit / Delete controls for non-admin users
- To promote a user to admin, update their MongoDB document directly:
  ```
  db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
  ```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally on port 27017 (or an Atlas connection string)

### Backend Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install django djangorestframework pymongo djangorestframework-simplejwt django-cors-headers python-decouple Pillow

python manage.py runserver
```

Make sure `core/db.py` points to your MongoDB instance:
```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['user_management_db']
```

Create the media folder for profile image uploads:
```
backend/media/profile_images/
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:5173` by default.

---

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register/` | Public | Register new user |
| POST | `/api/auth/login/` | Public | Login, returns JWT pair |
| GET | `/api/auth/me/` | Authenticated | Get current user info |

### User Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/` | Authenticated | List all users |
| POST | `/api/users/` | Admin only | Create user |
| GET | `/api/users/<id>/` | Authenticated | Get user detail |
| PUT | `/api/users/<id>/` | Admin only | Update user |
| DELETE | `/api/users/<id>/` | Admin only | Delete user |

### Profile
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/profile/me/` | Authenticated | Get own profile |
| PUT | `/api/profile/me/` | Authenticated | Update own email |
| POST | `/api/profile/me/image/` | Authenticated | Upload profile image |

---

## Key Design Decisions

**PyMongo over Django ORM** — users are stored as documents in a `users` MongoDB collection. Django's built-in auth system is not used for data storage, only for password hashing utilities (`make_password`, `check_password`).

**Custom JWT auth backend** — SimpleJWT's default auth class expects ORM users. A custom `MongoJWTAuthentication` class overrides `get_user()` to fetch the user document from MongoDB by the ID embedded in the token payload, returning a lightweight `MongoUser` object that satisfies DRF's `IsAuthenticated` check.

**Role enforcement on both sides** — the backend blocks unauthorized actions at the API level via `IsAdmin`. The frontend additionally hides controls based on the `role` stored in Redux — this is a UX convenience, not a security boundary (the API is the real guard).

**localStorage for tokens** — access and refresh tokens are stored in `localStorage` for simplicity. For production hardening, httpOnly cookies would be the more secure alternative.

---

## Notes

- Access tokens expire after 5 minutes (SimpleJWT default). A full refresh-token flow is not yet implemented — users will need to log in again after expiry.
- The `/admin/` Django admin panel is not connected to MongoDB users and is not used in this project.
- Profile images are served from `http://127.0.0.1:8000/media/` in development. For production, these should be served via a dedicated file server or object storage (e.g. S3).
