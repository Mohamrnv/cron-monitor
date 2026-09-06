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
</p>

---

## 🧩 The Problem

Cron jobs run silently in the background. When they fail — due to server crashes, bugs, expired credentials, or resource exhaustion — there is often **no immediate signal**. Failures are typically discovered only after downstream damage occurs: missing backups, unsent reports, or disk overflow from unprocessed temp files.

## 💡 The Solution

Cron Monitor expects periodic **heartbeat pings** from your scheduled jobs. If an expected ping doesn't arrive within a defined grace period, the service alerts your team via email or Slack.

> Similar to [Healthchecks.io](https://healthchecks.io), [Cronitor](https://cronitor.io), and [Dead Man's Snitch](https://deadmanssnitch.com).

---

## ⚡ How It Works

```
┌──────────────┐       ┌──────────────────┐       ┌─────────────┐
│  Your Server │       │   Cron Monitor   │       │  Alert      │
│  (cron job)  │──────▶│   (this API)     │──────▶│  (Email /   │
│              │ ping  │                  │ alert │   Slack)    │
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
5. If a job misses its expected ping → **alert is triggered**.

---

## 🏗️ Tech Stack

| Layer              | Technology          | Reason                                           |
| ------------------ | ------------------- | ------------------------------------------------ |
| **Runtime**        | Node.js + TypeScript | Type safety, modern async/await patterns          |
| **Framework**      | Express 5           | Lightweight, widely used, easy to extend          |
| **Database**       | MongoDB + Mongoose  | Flexible schema, fast reads for ping data         |
| **Background Jobs**| node-cron           | Periodic check for overdue jobs every 60 seconds  |
| **Notifications**  | Nodemailer, Slack   | Simple integration, no complex auth needed        |
| **Logging**        | Winston             | Structured logging with file and console output   |

---

## 📁 Project Structure

```
src/
├── config/             # Database connection, logger setup
├── controllers/        # Request handlers (jobsController, pingController)
├── models/             # Mongoose schemas (Job, Ping, Alert)
├── repositories/       # Data access layer (Repository Pattern)
├── routes/             # Express route definitions
├── services/           # Background worker, alert service
├── types/              # TypeScript interfaces (Job, Ping, Alert)
├── app.ts              # Express app configuration & middleware
└── server.ts           # Entry point — starts server & connects DB
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a cloud instance (e.g., MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohamrnv/cron-monitor.git
cd cron-monitor

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cron-monitor
```

### Running

```bash
# Development (auto-reload on file changes)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Build and run in one command
npm run build:run
```

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
| PATCH  | `/api/jobs/:id`   | Update job settings                      |
| DELETE | `/api/jobs/:id`   | Delete a job                             |
| POST   | `/api/jobs/:id/pause` | Pause / resume monitoring            |

### Ping Endpoints (Public)

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/ping/:token`        | Record a successful job completion    |
| GET    | `/ping/:token/start`  | Record that a job has started running |
| GET    | `/ping/:token/fail`   | Record an explicit job failure        |

### Example: Create a Job

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/jobs" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"name":"Nightly Backup","expectedIntervalSeconds":86400,"gracePeriodSeconds":3600}'

# curl (Linux/macOS)
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
  "lastStartedAt": null,
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
              missed expectedInterval
                           │
                  ┌────────▼───────────┐
                  │       LATE         │
                  │  (within grace     │
                  │   period)          │
                  └────────┬───────────┘
                           │
              missed grace period
                           │
                  ┌────────▼───────────┐
                  │       DOWN         │──── Alert Sent (Email/Slack)
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

A job can also be manually set to **PAUSED**, which stops all monitoring checks until resumed.

---

## 🛡️ Architecture Decisions

### Why the Repository Pattern?

Controllers never touch Mongoose directly. All database operations go through a repository interface (`IJobRepository`). This means:
- **Testability:** Repositories can be mocked in unit tests.
- **Flexibility:** Swapping MongoDB for PostgreSQL only requires a new repository implementation.

### Why Not Redis + BullMQ (Yet)?

At the expected scale (< 1,000 jobs), a simple polling query is not a bottleneck. Adding Redis introduces operational complexity without a justified trade-off. The scaling path is documented and ready for when it's needed.

---

## 📋 Roadmap

- [x] Job CRUD API (Create, Read)
- [x] Ping success endpoint
- [x] Ping start endpoint
- [x] Ping fail endpoint
- [ ] Background worker (overdue job detection)
- [ ] Email alerts via Nodemailer
- [ ] Slack webhook notifications
- [ ] Frontend dashboard
- [ ] Cron expression parsing
- [ ] Multi-user support with authentication
- [ ] Public status page per job

