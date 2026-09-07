# Cron Monitor — Frontend Dashboard Documentation

## 1. Goal of the Dashboard

A simple interface that displays the status of all registered jobs in the system in real-time. It allows adding new jobs and getting their ping URL instantly.

**Priority:** Quick visual clarity — anyone opening the dashboard should know in a second "what is down right now?" without having to read details.

---

## 2. Tech Stack

| Tool | Reason |
|---|---|
| React + TypeScript | Type safety, and using the same language as the backend makes it easy to share types |
| Vite | Faster setup and development server than Create React App |
| Tailwind CSS | Rapid styling without writing a lot of CSS, perfectly suited for a small-to-medium sized project |
| React Query (`@tanstack/react-query`) | Simplifies fetching + caching + auto-refetching instead of manual `useEffect` logic |
| React Router | Useful if we want to create a separate details page for each job |

> Note: No need for Redux or any heavy state management library — all data comes from the API and there is no complex local state that needs to be shared across many components.

---

## 3. Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── jobsApi.ts          ← All API calls in one place
│   ├── types/
│   │   └── job.ts              ← The same Job shape as the backend (shared or carefully duplicated)
│   ├── components/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── CreateJobModal.tsx
│   │   └── CopyPingUrl.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── JobDetailsPage.tsx
│   ├── hooks/
│   │   └── useJobs.ts          ← wrapper around useQuery
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

---

## 4. Pages and Components

### 4.1 `DashboardPage` (Main Page)

**Content:**
- Title + "Add Job" button that opens `CreateJobModal`
- Grid of `JobCard`s, one card per job
- Auto-refresh every 10 seconds via React Query (`refetchInterval: 10000`)

**Text Wireframe:**
```
┌─────────────────────────────────────────────┐
│  Cron Monitor              [+ Add Job]        │
├─────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │ 🟢 Backup  │  │ 🔴 Report  │  │ 🟡 Cleanup │ │
│  │ Healthy    │  │ Down       │  │ Late       │ │
│  │ 2 min ago  │  │ 3 hrs ago  │  │ 45 min ago │ │
│  └───────────┘  └───────────┘  └───────────┘ │
└─────────────────────────────────────────────┘
```

### 4.2 `JobCard`

**Displayed Data:**
- Job Name
- `StatusBadge` (Color + Text: 🟢 Healthy / 🟡 Late / 🔴 Down / ⚪ Paused)
- "Time since last ping" (Relative text like "2 minutes ago" — use `date-fns` library with `formatDistanceToNow`)
- Copy ping URL button (`CopyPingUrl`)
- Clicking on the card navigates to `JobDetailsPage`

### 4.3 `StatusBadge`

A simple component that takes `status` as a prop and returns a badge with the appropriate color:
```tsx
const statusConfig: Record<JobStatus, { color: string; label: string; emoji: string }> = {
  healthy: { color: 'bg-green-100 text-green-800', label: 'Healthy', emoji: '🟢' },
  late:    { color: 'bg-yellow-100 text-yellow-800', label: 'Late', emoji: '🟡' },
  down:    { color: 'bg-red-100 text-red-800', label: 'Down', emoji: '🔴' },
  paused:  { color: 'bg-gray-100 text-gray-600', label: 'Paused', emoji: '⚪' },
};
```

### 4.4 `CreateJobModal`

**Form:**
| Field | Type | Notes |
|---|---|---|
| Name | text input | required |
| Expected Interval | select/number + unit (minutes/hours/days) | converted to seconds before submission |
| Grace Period | number + unit | optional, defaults to 5 minutes |

After successful submission: the modal closes, the new job appears in the list immediately (React Query invalidation), and the ping URL is clearly displayed for instant copying (this is the most important step — the user must copy it to put into their cron job).

### 4.5 `JobDetailsPage`

**Content:**
- All job details (Name, Status, Interval, Grace period)
- Log of the last 20 pings (Time + Type: success/start/fail)
- Pause/Resume button
- Delete button (with confirmation)
- Full ping URL with all three variants (`/ping/:token`, `/ping/:token/start`, `/ping/:token/fail`) and a copy button for each

### 4.6 `CopyPingUrl`

A small component: URL text + "Copy" button using `navigator.clipboard.writeText()`, showing "Copied!" for 2 seconds after clicking.

---

## 5. Data Fetching

### 5.1 `jobsApi.ts`
```ts
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/api/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function createJob(data: CreateJobDto): Promise<Job> {
  const res = await fetch(`${BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}
```

### 5.2 `useJobs.ts` (React Query hook)
```ts
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    refetchInterval: 10000, // refresh every 10 seconds
  });
}
```

**Reason for using `refetchInterval` instead of WebSockets:**
A project of this size doesn't need true real-time functionality (a 10-second delay in status updates is not critical). WebSockets would add unnecessary complexity (persistent connections, reconnect logic on drop) with no real benefit for this scale. If you want to add it later as an "enhancement", it would make a great bullet point in the README under "Future Improvements".

---

## 6. UX Edge Cases

| Case | Desired Behavior |
|---|---|
| No jobs yet | Friendly message + "Create your first job" button instead of a blank screen |
| Data fetch failed (API down) | Clear error message + "Retry" button |
| Newly created job (`lastPingAt = null`) | Special badge "Waiting for first ping" instead of mistakenly showing as Down |
| Copying URL fails (old browser) | fallback: display the URL as manually selectable text |

---

## 7. Frontend Build Plan (Suggested)

1. Setup: Vite + React + TypeScript + Tailwind
2. `jobsApi.ts` + `useJobs` hook + test a simple fetch with mock data
3. `StatusBadge` + `JobCard` (isolated components, can be visually tested independently)
4. `DashboardPage` putting everything together with real data from the backend
5. `CreateJobModal` + connect it to the `createJob` mutation
6. `JobDetailsPage` + pings log
7. Handle edge cases (empty, error, loading)
8. Final polish: mobile responsive design, deletion confirmation, toast notifications for success/failure

---

## 8. Worth Mentioning in the README

Explain why you chose **polling every 10 seconds instead of WebSockets** — it's the exact same "start simple, document why you didn't overcomplicate" logic we followed in the backend with the decision not to use Redis/BullMQ right away.
