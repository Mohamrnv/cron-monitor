import { format, subDays, eachDayOfInterval } from 'date-fns';
import type { Ping } from '../types/job';

interface Props {
  pings: Ping[];
  expectedIntervalSeconds: number;
}

const TYPE_COLOR: Record<string, string> = {
  success: '#10b981',
  start: '#f59e0b',
  fail: '#ef4444',
};

export function PingHistoryChart({ pings, expectedIntervalSeconds }: Props) {
  const now = new Date();
  const days = eachDayOfInterval({ start: subDays(now, 6), end: now });

  // Group pings by day
  const pingsByDay: Record<string, Ping[]> = {};
  days.forEach((d) => {
    pingsByDay[format(d, 'yyyy-MM-dd')] = [];
  });
  pings.forEach((ping) => {
    const key = format(new Date(ping.receivedAt), 'yyyy-MM-dd');
    if (pingsByDay[key]) pingsByDay[key].push(ping);
  });

  const maxPings = Math.max(...Object.values(pingsByDay).map((p) => p.length), 1);

  // How many pings are expected per day
  const expectedPerDay = Math.ceil(86400 / expectedIntervalSeconds);

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-medium text-slate-300 mb-1">7-Day Ping Activity</h2>
      <p className="text-xs text-slate-600 mb-4">Expected ~{expectedPerDay} pings/day</p>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-24">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayPings = pingsByDay[key] ?? [];
          const total = dayPings.length;
          const hasFailure = dayPings.some((p) => p.type === 'fail');
          const heightPct = total === 0 ? 4 : Math.max(12, (total / maxPings) * 100);

          const barColor = total === 0
            ? 'bg-white/5'
            : hasFailure
            ? 'bg-red-500/70'
            : total >= expectedPerDay
            ? 'bg-emerald-500/80'
            : 'bg-amber-500/70';

          const glowClass = total === 0
            ? ''
            : hasFailure
            ? 'shadow-[0_0_6px_#ef444460]'
            : total >= expectedPerDay
            ? 'shadow-[0_0_6px_#10b98160]'
            : 'shadow-[0_0_6px_#f59e0b60]';

          const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

          return (
            <div key={key} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                <div className="bg-surface-300 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-slate-200 whitespace-nowrap shadow-xl">
                  <p className="font-medium">{format(day, 'MMM d')}</p>
                  <p className="text-slate-400">{total} ping{total !== 1 ? 's' : ''}</p>
                  {hasFailure && <p className="text-red-400">Contains failures</p>}
                </div>
                <div className="w-2 h-2 bg-surface-300 border-r border-b border-white/10 rotate-45 -mt-1" />
              </div>

              {/* Bar */}
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 ${barColor} ${glowClass}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Day label */}
              <span className={`text-[10px] tabular-nums ${isToday ? 'text-slate-300 font-medium' : 'text-slate-600'}`}>
                {isToday ? 'Today' : format(day, 'EEE')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
        {[
          { color: 'bg-emerald-500/80', label: 'On target' },
          { color: 'bg-amber-500/70', label: 'Below expected' },
          { color: 'bg-red-500/70', label: 'Has failures' },
          { color: 'bg-white/5', label: 'No pings' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            <span className="text-[10px] text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Recent pings timeline */}
      {pings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-slate-600 mb-2">Recent activity</p>
          <div className="flex items-center gap-1 flex-wrap">
            {pings.slice(0, 30).map((ping, i) => {
              const color = TYPE_COLOR[ping.type ?? 'success'] ?? '#10b981';
              return (
                <div
                  key={ping._id ?? i}
                  title={`${ping.type ?? 'success'} — ${format(new Date(ping.receivedAt), 'MMM d HH:mm')}`}
                  style={{
                    backgroundColor: color + '90',
                    boxShadow: `0 0 4px ${color}60`,
                  }}
                  className="w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-default"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
