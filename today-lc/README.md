# Today Ta'lim Markazi — Full-Stack Platform

A complete, fully functional course enrollment web platform for **Today Ta'lim Markazi** (Urganch & Shovot, Uzbekistan) tutoring center.

This repository contains two sub-projects:
- **`backend/`**: A RESTful Express.js API server using Prisma ORM with PostgreSQL, rate-limiting, authentication using JWT stored in httpOnly cookies, Zod validation, and Nodemailer email alerts.
- **`frontend/`**: A Next.js 14 Web Application (App Router) using Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Framer Motion, and Sonner.

---

## Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (15-min Access Token + 7-day Refresh Token, stored in `httpOnly` secure cookies)
- **Password Hashing**: Bcrypt (12 rounds)
- **Input Validation**: Zod
- **File Uploads**: Multer (saves images to local `/uploads` folder)
- **Email Notifications**: Nodemailer (warns on missing SMTP configs, safe for testing)
- **Security**: Helmet, CORS, and `express-rate-limit` (general API limits + specialized auth and enrollment sub-routes)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui (following a premium `#0B1D3A` deep navy and `#F5A623` gold design language)
- **Forms**: React Hook Form + Zod resolvers
- **State Management**: Zustand (stores admin login state)
- **Data Fetching**: TanStack Query (React Query v5)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Confetti**: `confetti-js` (fires on public enrollment success)

---

## Project Structure

```
today-lc/
├── backend/                  # REST API Server
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma database schema
│   │   └── seed.js           # Seed script (courses, admins, enrollments)
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth guard, Zod validations, rate-limiting
│   │   ├── routes/           # REST endpoints
│   │   ├── services/         # Business logic (email, CSV streaming, db queries)
│   │   └── index.js          # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                 # Next.js Web App
│   ├── app/
│   │   ├── page.tsx          # Public Uzbek Landing Page
│   │   └── admin/            # Admin Panel pages
│   ├── components/
│   │   ├── admin/            # Sidebar, StatsCard, EnrollTable
│   │   ├── public/           # Navbar, Hero, CourseGrid, EnrollModal
│   │   └── ui/               # shadcn styled UI pieces
│   ├── lib/
│   │   ├── api.ts            # Axios configuration with token-refresh interceptors
│   │   ├── store.ts          # Zustand store
│   │   └── validators.ts     # Centralized Zod schemas
│   ├── tailwind.config.ts
│   └── package.json
│
├── render.yaml               # Render multi-service infrastructure deployment config
└── README.md                 # Complete documentation
```

---

## Local Installation

### Prerequisites
- Node.js 18+
- A PostgreSQL database instance (local or hosted, e.g., Neon PostgreSQL)

### 1. Database and Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your connection strings and SMTP config:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/today_lc?schema=public"
   JWT_ACCESS_SECRET="today-lc-super-secret-access-token-key-2026-xyz"
   JWT_REFRESH_SECRET="today-lc-super-secret-refresh-token-key-2026-abc"
   ```
4. Install dependencies, run Prisma migrations, and seed the database:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run db:seed
   ```
5. Start the API server in development mode:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000`. You can test health checks at `http://localhost:4000/health`.

---

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Create your `.env.local` configuration file:
   ```bash
   cp .env.example .env.local
   ```
3. Verify that `NEXT_PUBLIC_API_URL` points to the running backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
4. Install dependencies and run the Next.js development server:
   ```bash
   npm install
   npm run dev
   ```
   The client will run on `http://localhost:3000`.

---

## Default Admin Credentials

The seed command creates two default accounts for logging in at `http://localhost:3000/admin`:

| Email | Password | Role |
| :--- | :--- | :--- |
| **`superadmin@today.uz`** | `SuperAdmin2025!` | `SUPERADMIN` (Full CRUD + Admin management) |
| **`admin@today.uz`** | `Admin2025!` | `ADMIN` (Enrollment CRUD + Course management) |

---

## Deploying to Render

This project includes a multi-service `render.yaml` configuration template that automatically provisions both the frontend and backend services in a unified layout.

### Instructions:
1. Push your codebase to a GitHub repository.
2. In your Render Dashboard, click **New +** and select **Blueprint**.
3. Select your repository.
4. Render will parse the `render.yaml` file and prompt you for the following parameters:
   - **`DATABASE_URL`**: Your PostgreSQL connection string.
   - **`JWT_ACCESS_SECRET`**: A random 32+ character security secret.
   - **`JWT_REFRESH_SECRET`**: A random 32+ character security secret.
   - **`FRONTEND_URL`**: The static URL assigned by Render to your frontend web service.
   - **`NEXT_PUBLIC_API_URL`**: The static URL assigned by Render to your backend API service.
   - **`SMTP_USER`** & **`SMTP_PASS`**: Your SMTP provider credentials for transactional notifications (optional).
5. Deploy the Blueprint! Render will automatically run the builds and link the services together.
