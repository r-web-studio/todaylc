# Today Ta'lim Markazi — Full-Stack Platform

Course enrollment platform for Today Ta'lim Markazi (Urganch & Shovot, Uzbekistan).

## Tech Stack

**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL, JWT auth, Zod
**Frontend:** Next.js 14, Tailwind CSS, TanStack Query, Zustand, Recharts, Framer Motion

## Project Structure

```
today-lc/
├── backend/          # Express API server
│   ├── prisma/       # Schema + seed
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── index.js
├── frontend/         # Next.js 14 App Router
│   ├── app/
│   │   └── admin/    # Admin panel pages
│   ├── components/
│   │   ├── admin/    # Sidebar, StatsCard, EnrollTable
│   │   ├── public/   # Navbar, Hero, CourseGrid, etc.
│   │   └── ui/       # shadcn-style components
│   └── lib/          # api, store, utils
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend

```bash
cd backend
cp .env.example .env   # Edit with your DB credentials
npm install
npx prisma migrate dev --name init
npm run db:seed        # Creates admin accounts + sample data
npm run dev            # Starts on port 4000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local   # Edit NEXT_PUBLIC_API_URL if needed
npm install
npm run dev                  # Starts on port 3000
```

### Default Admin Accounts

| Email | Password | Role |
|-------|----------|------|
| superadmin@today.uz | SuperAdmin2025! | SUPERADMIN |
| admin@today.uz | Admin2025! | ADMIN |

## API Endpoints

### Public
- `POST /api/enrollments` — Submit enrollment form
- `GET /api/courses` — List active courses

### Admin (JWT required)
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `GET /api/enrollments` — List (paginated, filterable)
- `PATCH /api/enrollments/:id/status` — Update status
- `DELETE /api/enrollments/:id` — Delete (SUPERADMIN)
- `GET /api/enrollments/export/csv` — Export CSV
- `POST /api/courses` — Create course
- `PUT /api/courses/:id` — Update course
- `DELETE /api/courses/:id` — Soft-delete course
- `GET /api/dashboard/stats` — Dashboard statistics
- `GET /api/users` — List admins (SUPERADMIN)
- `POST /api/users` — Create admin (SUPERADMIN)
- `DELETE /api/users/:id` — Delete admin (SUPERADMIN)

## Design

- Primary: `#0B1D3A` (deep navy)
- Accent: `#F5A623` (gold)
- Font: Inter (body), Plus Jakarta Sans (headings)
