import type { JobStatus } from '../types/job';

interface StatusConfig {
  label: string;
  dotClass: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const config: Record<JobStatus, StatusConfig> = {
  healthy: {
    label: 'Healthy',
    dotClass: 'status-dot-healthy',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  late: {
    label: 'Late',
    dotClass: 'status-dot-late',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  down: {
    label: 'Down',
    dotClass: 'status-dot-down',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  paused: {
    label: 'Paused',
    dotClass: 'status-dot-paused',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
  },
};

interface Props {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const s = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium
        ${s.bgColor} ${s.borderColor} ${s.textColor}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <span className={s.dotClass} />
      {s.label}
    </span>
  );
}
