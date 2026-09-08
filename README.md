<p align="center">
  <h1 align="center">⏰ Cron Monitor</h1>
  <p align="center">
    <strong>Dead Man's Switch for Scheduled Jobs</strong>
  </p>
  <p align="center">
    A monitoring service that watches over your cron jobs and alerts you when they fail silently.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 🧩 The Problem

Cron jobs run silently in the background. When they fail — due to server crashes, bugs, expired credentials, or resource exhaustion — there is often **no immediate signal**. Failures are typically discovered only after downstream damage occurs: missing backups, unsent reports, or disk overflow from unprocessed temp files.

## 💡 The Solution

Cron Monitor expects periodic **heartbeat pings** from your scheduled jobs. If an expected ping doesn't arrive within a defined grace period, the service alerts your team via email.

> Similar to [Healthchecks.io](https://healthchecks.io), [Cronitor](https://cronitor.io), and [Dead Man's Snitch](https://deadmanssnitch.com).

---

## ⚡ How It Works

```
┌──────────────┐       ┌──────────────────┐       ┌─────────────┐
│  Your Server │       │   Cron Monitor   │       │  Alert      │
│  (cron job)  │──────▶│   (this API)     │──────▶│  (Email)    │
│              │ ping  │                  │ alert │             │
└──────────────┘       └──────────────────┘       └─────────────┘
```

1. **Register** a job in the monitor (e.g., "Nightly DB Backup", runs every 24 hours).
2. The system generates a unique **ping URL** for that job.
3. Add a single `curl` call to the end of your cron script:
   ```bash
   # Your existing cron job
   pg_dump mydb > /backups/nightly.sql

   # Notify the monitor that the job completed successfully
   curl https://your-monitor.com/ping/your-unique-token
   ```
4. A **background worker** continuously checks: *"Has this job pinged within its expected window?"*
5. If a job misses its expected ping → **alert is triggered** and an email is sent.

---

## 🏗️ Tech Stack

### Backend
| Layer              | Technology           | Reason                                           |
| ------------------ | -------------------- | ------------------------------------------------ |
| **Runtime**        | Node.js + TypeScript | Type safety, modern async/await patterns          |
| **Framework**      | Express 5            | Lightweight, widely used, easy to extend          |
| **Database**       | MongoDB + Mongoose   | Flexible schema, fast reads for ping data         |
| **Background Jobs**| node-cron            | Periodic check for overdue jobs every 60 seconds  |
| **Notifications**  | Nodemailer           | Simple SMTP integration (Mailtrap for dev)        |
| **Logging**        | Winston              | Structured logging with file and console output   |
| **Security**       | Helmet & Rate Limit  | Production-ready API protection and sanitization  |

### Frontend
| Layer          | Technology              | Reason                                          |
| -------------- | ----------------------- | ----------------------------------------------- |
| **Framework**  | React 18 + TypeScript   | Type safety, component-driven UI                |
| **Build Tool** | Vite                    | Fast HMR, modern bundling                       |
| **Styling**    | Tailwind CSS v3         | Utility-first, custom dark design system        |
| **Data**       | React Query (TanStack)  | Auto-refresh every 10s, caching, mutations      |
| **Routing**    | React Router v6         | Dashboard + Job Details pages                   |

---

## 📁 Project Structure

```
cron-monitor/
├── src/                        # Backend (Node.js + Express)
│   ├── config/                 # Database connection, logger setup
│   ├── controllers/            # Request handlers (jobsController, pingController)
│   ├── models/                 # Mongoose schemas (Job, Ping, Alert)
│   ├── repositories/           # Data access layer (Repository Pattern)
│   ├── routes/                 # Express route definitions
│   ├── services/               # Background worker, alert service
│   ├── types/                  # TypeScript interfaces (Job, Ping, Alert)
│   ├── app.ts                  # Express app configuration & middleware
│   └── server.ts               # Entry point — starts server & connects DB
└── frontend/                   # Frontend (React + Vite)
    └── src/
        ├── api/                # Centralized API calls
        ├── components/         # StatusBadge, JobCard, Navbar, Modal, EditJobModal
        ├── hooks/              # React Query hooks (useJobs, useCreateJob, useUpdateJob)
        ├── pages/              # DashboardPage, JobDetailsPage
        └── types/              # Shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a cloud instance (e.g., MongoDB Atlas)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Mohamrnv/cron-monitor.git
cd cron-monitor

# Install backend dependencies
npm install

# Create your environment file
```

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cron-monitor

# Mailtrap (for development email testing)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
ALERT_EMAIL=your@email.com
```

```bash
# Start backend in development mode
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install frontend dependencies
npm install

# Create frontend env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start frontend dev server
npm run dev
```

Open **http://localhost:5173** to view the dashboard.

### Running Both Simultaneously

Open two separate terminals:
- Terminal 1 (root): `npm run dev` → API on port `3000`
- Terminal 2 (frontend/): `npm run dev` → Dashboard on port `5173`

---

## 📡 API Reference

### Health Check

| Method | Endpoint   | Description                |
| ------ | ---------- | -------------------------- |
| GET    | `/health`  | Check if the server is up  |

### Jobs Management

| Method | Endpoint          | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| POST   | `/api/jobs`       | Create a new monitored job               |
| GET    | `/api/jobs`       | List all monitored jobs                  |
| GET    | `/api/jobs/:id`   | Get job details + last 20 pings          |
| PATCH  | `/api/jobs/:id`   | Update a job's intervals or name         |
| DELETE | `/api/jobs/:id`   | Delete a job                             |

### Ping Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/ping/:token`        | Record a successful job completion    |
| GET    | `/ping/:token/start`  | Record that a job has started running |
| GET    | `/ping/:token/fail`   | Record an explicit job failure        |

### Example: Create a Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"name":"Nightly Backup","expectedIntervalSeconds":86400,"gracePeriodSeconds":3600}'
```

**Response:**
```json
{
  "_id": "6a9dc2b553378f8c03b7d1b0",
  "name": "Nightly Backup",
  "pingToken": "0ec77015-b1d7-411b-b92a-b3988ef9db71",
  "expectedIntervalSeconds": 86400,
  "gracePeriodSeconds": 3600,
  "status": "healthy",
  "lastPingAt": null,
  "nextExpectedPingAt": "2026-09-07T20:44:53.885Z",
  "createdAt": "2026-09-06T19:44:53.885Z"
}
```

### Example: Send a Ping

```bash
curl http://localhost:3000/ping/0ec77015-b1d7-411b-b92a-b3988ef9db71
# Response: OK
```

---

## 🔄 Job Status Lifecycle

```
                  ┌────────────────────┐
                  │      HEALTHY       │
                  │  (pinging on time) │
                  └────────┬───────────┘
                           │
              missed expectedInterval + gracePeriod
                           │
                  ┌────────▼───────────┐
                  │       DOWN         │──── Alert Sent (Email)
                  │  (alert triggered) │
                  └────────┬───────────┘
                           │
                  ping received (recovery)
                           │
                  ┌────────▼───────────┐
                  │      HEALTHY       │
                  │  (recovered)       │
                  └────────────────────┘
```

### Alert Cooldown

- When a job goes `DOWN`, **only one alert is sent**.
- No repeated alerts while the job stays down (no spam).
- The cooldown resets only when the job **recovers** (`HEALTHY`) and goes down again.

---

## 🛡️ Architecture Decisions & Performance

### Why the Repository Pattern?

Controllers never touch Mongoose directly. All database operations go through a repository interface (`IJobRepository`). This means:
- **Testability:** Repositories can be mocked in unit tests.
- **Flexibility:** Swapping MongoDB for PostgreSQL only requires a new repository implementation.

### Security First

The API is protected using **Helmet** for HTTP header security and **express-rate-limit** to prevent DDOS and brute-force scraping, ensuring reliable uptime for mission-critical pings.

### Performance Under Load

In local load tests using `autocannon`, the Node.js Express server is capable of comfortably processing **7,000+ requests per second** on a single thread. The MongoDB models use optimized indexes on `pingToken` and `nextExpectedPingAt` for lightning-fast read/write throughput during high-volume cron ingestion.

---

## 📋 Roadmap

- [x] Job CRUD API (Create, Read, Update, Delete)
- [x] Ping success endpoint
- [x] Ping start endpoint
- [x] Ping fail endpoint
- [x] Background worker (overdue job detection)
- [x] Email alerts via Nodemailer
- [x] Alert cooldown (no duplicate alerts)
- [x] React dashboard (job list, status badges, auto-refresh)
- [x] Create job & Edit job modals
- [x] Job details page with ping history
- [x] Deployment (Railway for API, Vercel for Frontend)
- [ ] Slack webhook notifications
- [ ] Cron expression parsing (e.g., `0 2 * * *`)
- [ ] Multi-user support with authentication
- [ ] Public status page per job
