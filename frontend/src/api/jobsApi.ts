import type { Job, CreateJobDto, Ping } from '../types/job';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/api/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function fetchJobById(id: string): Promise<{ job: Job; pings: Ping[] }> {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`);
  if (!res.ok) throw new Error('Job not found');
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

export async function deleteJob(id: string): Promise<void> {
  await fetch(`${BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
}

export function getPingUrl(token: string, variant: '' | '/start' | '/fail' = ''): string {
  return `${BASE_URL}/ping/${token}${variant}`;
}
