interface ProgressRingProps {
  /** 0 to 1 */
  progress: number;
  status: 'healthy' | 'late' | 'down' | 'paused';
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

const STATUS_COLOR: Record<string, string> = {
  healthy: '#10b981',
  late: '#f59e0b',
  down: '#ef4444',
  paused: '#6b7280',
};

const STATUS_TRAIL: Record<string, string> = {
  healthy: '#10b98120',
  late: '#f59e0b20',
  down: '#ef444420',
  paused: '#6b728020',
};

export function ProgressRing({
  progress,
  status,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const dashOffset = circumference * (1 - clampedProgress);
  const color = STATUS_COLOR[status] ?? '#6b7280';
  const trail = STATUS_TRAIL[status] ?? '#6b728020';
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Trail */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={trail}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && (
            <span className="text-slate-100 font-semibold text-lg leading-tight">{label}</span>
          )}
          {sublabel && (
            <span className="text-slate-500 text-xs mt-0.5 leading-tight">{sublabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
