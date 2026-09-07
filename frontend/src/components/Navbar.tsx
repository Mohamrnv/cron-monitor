import { Link } from 'react-router-dom';
import { Activity, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function Navbar() {
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-DEFAULT/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Activity size={14} className="text-indigo-400" />
          </div>
          <span className="font-medium text-slate-200 text-sm group-hover:text-white transition-colors">
            Cron Monitor
          </span>
        </Link>

        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <RefreshCw size={11} className="animate-spin-slow" />
          <span>Refreshing in <span className="text-slate-400 tabular-nums">{countdown}s</span></span>
        </div>
      </div>
    </header>
  );
}
