import type { Job } from '../types/job';

interface Props {
  job: Job;
}

const STATUS_BAR: Record<string, string> = {
  healthy: 'bg-emerald-500',
  late: 'bg-amber-500',
  down: 'bg-red-500',
  paused: 'bg-slate-500',
};

const STATUS_GLOW: Record<string, string> = {
  healthy: 'shadow-[0_0_8px_#10b98180]',
  late: 'shadow-[0_0_8px_#f59e0b80]',
  down: 'shadow-[0_0_8px_#ef444480]',
  paused: '',
};

/** Returns 0–1 representing how far through the current interval window we are. */
function calcProgress(job: Job): number {
  if (!job.lastPingAt || !job.nextExpectedPingAt) return 0;

  const windowMs =
    (job.expectedIntervalSeconds + (job.gracePeriodSeconds ?? 0)) * 1000;
  const windowStart = new Date(job.lastPingAt).getTime();
  const now = Date.now();
  const elapsed = now - windowStart;

  return Math.min(1, Math.max(0, elapsed / windowMs));
}

export function IntervalProgressBar({ job }: Props) {
  const progress = calcProgress(job);
  const pct = Math.round(progress * 100);
  const barColor = STATUS_BAR[job.status] ?? 'bg-slate-500';
  const glow = STATUS_GLOW[job.status] ?? '';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-slate-600">Window progress</span>
        <span className="text-[10px] text-slate-500 tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${glow}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
