import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import type { Job } from '../types/job';
import { StatusBadge } from './StatusBadge';
import { CopyPingUrl } from './CopyPingUrl';
import { getPingUrl } from '../api/jobsApi';
import { IntervalProgressBar } from './IntervalProgressBar';

interface Props {
  job: Job;
}

function formatInterval(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

export function JobCard({ job }: Props) {
  const navigate = useNavigate();

  const lastPingText = job.lastPingAt
    ? formatDistanceToNow(new Date(job.lastPingAt), { addSuffix: true })
    : null;

  const isDown = job.status === 'down';
  const isNew = !job.lastPingAt;

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className={`glass-card p-5 flex flex-col gap-4 cursor-pointer group
        hover:border-white/[0.12] hover:bg-surface-200 transition-all duration-200 animate-fadeInUp
        ${isDown ? 'border-red-500/20 shadow-glow-red/20' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-100 truncate group-hover:text-white transition-colors">
            {job.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every {formatInterval(job.expectedIntervalSeconds)}
            {job.gracePeriodSeconds > 0 && ` + ${formatInterval(job.gracePeriodSeconds)} grace`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={job.status} size="sm" />
          <ExternalLink size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>

      {/* Last ping info */}
      <div className="flex items-center gap-2 text-xs">
        {isNew ? (
          <span className="flex items-center gap-1.5 text-amber-400/80">
            <AlertTriangle size={12} />
            Waiting for first ping
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-slate-500">
            <Clock size={12} />
            Last ping <span className="text-slate-400">{lastPingText}</span>
          </span>
        )}
      </div>

      {/* Interval progress */}
      {job.lastPingAt && <IntervalProgressBar job={job} />}

      {/* Copy URL */}
      <div onClick={(e) => e.stopPropagation()}>
        <CopyPingUrl url={getPingUrl(job.pingToken)} />
      </div>
    </div>
  );
}
