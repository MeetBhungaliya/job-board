# Job Board – Backend & Admin Dashboard

This repository contains a **full MERN-style backend** for importing jobs from external feeds and a **Next.js admin dashboard** to monitor imports, analytics, and browse job listings.

- **Backend:** Node.js, Express, TypeScript, MongoDB, Redis, BullMQ, cron, SSE  
- **Admin UI:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, shadcn/ui, TanStack Table

---

## 🔭 High-Level Overview

### Backend (server/)

A scalable import service that:

- Fetches jobs from multiple **RSS/Atom feeds**
- Parses & normalizes job data
- Uses **Redis + BullMQ** to process imports asynchronously in background workers
- Stores jobs and import logs in **MongoDB**
- Exposes APIs for:
  - Running imports (all feeds / single feed)
  - Listing import logs
  - Listing jobs
  - Getting job details
  - Analytics summary (totals, last import, jobs by source)
- Pushes **live updates** via **Server-Sent Events (SSE)** so the UI auto-refreshes

### Admin UI (admin/)

A modern dashboard that:

- Shows **Analytics** on `/`:
  - Total jobs, imports, new/updated jobs, failures, jobs by source, last import details
- Lists **Import history** on `/imports`:
  - TanStack table with filters, tabs (All / Failed / Successful), search, date range
  - “Run All Feeds” button
  - Live auto-refresh using SSE
- Lists **Jobs** on `/jobs`:
  - Filters (search, source, date range)
  - Tabs (All / Last 7 days / Today)
  - Table with link to detail view
- Shows **Job detail** on `/jobs/[id]`:
  - Title, company, location, category, posted date, source, external URL
  - Rendered HTML job description

---

## 🧱 Tech Stack

### Backend

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Cache / Queue:** Redis
- **Job Queue:** BullMQ
- **Scheduling:** node-cron
- **Real-time-ish updates:** Server-Sent Events (SSE)
- **Testing tooling (optional):** Postman collection

### Admin UI

- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui
- **Icons:** lucide-react
- **Table:** @tanstack/react-table
- **State & data:** Native React state + server actions + fetch

---

## 📁 Repository Structure

```txt
.
├── server/           # Backend API, workers, cron, queues
│   ├── src/
│   │   ├── config/       # env, db, redis, bullmq config
│   │   ├── models/       # Job, ImportLog schemas
│   │   ├── routes/       # /api/imports, /api/jobs, /api/analytics, /api/events, etc.
│   │   ├── controllers/  # import, job, analytics, SSE controllers
│   │   ├── services/     # import service, job service, analytics service
│   │   ├── workers/      # BullMQ worker for processing job imports
│   │   ├── events/       # SSE event broadcaster
│   │   └── utils/        # helpers, error handlers, ApiSuccess/ApiError
│   ├── package.json
│   └── ...
└── admin/           # Next.js admin dashboard
    ├── app/
    │   ├── layout.tsx        # Global layout with shadcn Sidebar
    │   ├── page.tsx          # Dashboard (analytics overview)
    │   ├── imports/          # Import history page & client component
    │   ├── jobs/             # Jobs list + [id] detail
    │   └── ...
    ├── components/           # ui/ (shadcn), layout, tables, etc.
    ├── lib/                  # api helpers, shared types
    ├── package.json
    └── ...
