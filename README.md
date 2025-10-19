# AI-Integrated Human Resource & Recruitment Management System

A lightweight HRMS/ATS platform that combines candidate management, AI-assisted ranking and workforce analytics. The system is split into independently deployable services so you can extend each capability without touching the others.

## Architecture

- **Web (React + Vite)** – unified control center for HR, Talent Acquisition and leadership with live hiring dashboards, AI ranking view and candidate self-service profile.
- **API Gateway (Express + Prisma)** – central REST API that manages authentication, job/candidate/application flows, resume storage metadata, AI scoring and audit logging.
- **Worker (BullMQ ready)** – background workers (currently stubbed) for future scheduling and automation needs.
- **AI service (Python stub)** – placeholder to plug in custom LLM/embedding workloads.
- **Shared infrastructure** – Postgres, Redis and MinIO shipped via Docker Compose for local development.

## Feature highlights

### Candidate
- JWT-based login/register.
- Maintain professional profile (headline, skills, years of experience, bio).
- Upload multiple resumes (presigned MinIO URLs) and mark a default CV.
- Apply to jobs and monitor status from a consolidated applications page.

### HR / Talent Acquisition
- Create, update and browse jobs with Markdown job descriptions, compensation range and tag-based skills.
- Manage applications through funnel states (SUBMITTED → SCREENING → INTERVIEW → OFFER/HIRED/REJECTED) with inline notes.
- Trigger AI ranking (TF–IDF + cosine + skill bonus) to surface best-fit resumes, inspect matched/missing skills and export CSV snapshots.
- View seed interview and resume data for demo scenarios.

### Admin
- Minimal user management overview with role visibility.
- Audit log capturing who created/updated jobs or modified applications.
- Service health check exposed at `/healthz`.

## API surface (selected endpoints)

| Endpoint | Description |
| --- | --- |
| `POST /auth/register`, `POST /auth/login`, `GET /auth/me` | Authentication + profile hydrate |
| `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PATCH /jobs/:id` | Job CRUD (HR/Admin) |
| `GET /candidates/:userId`, `PATCH /candidates/:userId` | Candidate profile management |
| `POST /resumes/presign`, `POST /resumes`, `GET /resumes/:id` | Resume upload flow (MinIO presign + metadata) |
| `POST /applications`, `PATCH /applications/:id` | Submit/update applications |
| `GET /applications/by-job/:jobId`, `GET /applications/ranking/:jobId`, `GET /applications/mine` | Pipeline dashboards + AI ranking |
| `GET /admin/users` | Admin user list |
| `GET /healthz` | Health endpoint |

## Data model (Prisma)

`User`, `Candidate`, `HRProfile`, `Job`, `Resume`, `Application`, `Interview`, `Embedding`, `AuditLog` with enum support for `Role`, `ApplicationStatus`, `ResumeStatus` and `EntityType`. See [`apps/api-gateway/prisma/schema.prisma`](apps/api-gateway/prisma/schema.prisma) for full definitions.

## AI ranking logic

1. Normalize JD and resume/candidate text (lowercase, basic stop-word removal for EN/VN).
2. Build term frequency vectors and compute cosine similarity (0–100 scale).
3. Add +5 bonus per matched skill from job requirements (capped at +25).
4. Return ranked list with matched/missing skill highlights suitable for CSV export.

## Getting started

1. **Boot supporting services**
   ```bash
   pnpm dev:docker
   ```
2. **Provision database schema and seed demo data**
   ```bash
   pnpm --filter api-gateway db:setup
   ```
3. **Run web dashboard and API (parallel)**
   ```bash
   pnpm dev
   ```

The API listens on `http://localhost:4000` and the web dashboard on `http://localhost:3000`. Set `VITE_API_URL` or `NEXT_PUBLIC_API_URL` if you proxy through a different hostname.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hrms.local` | `Admin123!` |
| HR | `hr@hrms.local` | `Hr123456` |
| Candidate | `candidate@hrms.local` | `Candidate123` |

## Next steps

- Plug Prisma into a production-grade Postgres or serverless provider.
- Connect BullMQ worker to schedule AI scoring, reminders or sync jobs.
- Move AI ranking to dedicated `ai-service` (e.g. OpenAI/Azure, embedding + pgvector).
- Harden authentication (refresh tokens, role-based access matrix, audit queries).
