import { Radio } from 'lucide-react';

interface Props {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fadeInUp">
      <div className="w-16 h-16 rounded-2xl bg-surface-200 border border-white/[0.06] flex items-center justify-center">
        <Radio size={28} className="text-slate-500" />
      </div>
      <div className="text-center">
        <h2 className="font-serif text-2xl text-slate-200 mb-2">No jobs yet</h2>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          Add your first monitored job to start tracking cron runs and getting alerts when things go quiet.
        </p>
      </div>
      <button onClick={onCreateClick} className="btn-primary">
        Create your first job
      </button>
    </div>
  );
}
