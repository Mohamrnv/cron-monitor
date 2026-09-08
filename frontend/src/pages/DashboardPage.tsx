import { useState } from 'react';
import { Plus, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';
import { CreateJobModal } from '../components/CreateJobModal';
import type { Job } from '../types/job';

function StatCard({ label, value, color, delay = '' }: { label: string; value: number; color: string; delay?: string }) {
  return (
    <div className={`stat-card animate-fadeInUp ${delay}`}>
      <span className={`text-3xl font-serif ${color} animate-countUp`}>{value}</span>
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function DashboardPage() {
  const { data: jobs, isLoading, isError, refetch } = useJobs();
  const [showModal, setShowModal] = useState(false);

  const healthy = jobs?.filter((j: Job) => j.status === 'healthy').length ?? 0;
  const down = jobs?.filter((j: Job) => j.status === 'down').length ?? 0;
  const late = jobs?.filter((j: Job) => j.status === 'late').length ?? 0;
  const total = jobs?.length ?? 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero header */}
      <div className="flex items-end justify-between mb-10 animate-fadeInDown">
        <div>
          <h1 className="font-serif text-4xl text-slate-100 mb-1">Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time status of your monitored cron jobs</p>
        </div>
        <button id="create-job-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add Job
        </button>
      </div>

      {/* Stats row */}
      {total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total"   value={total}   color="text-slate-200"   delay="stagger-1" />
          <StatCard label="Healthy" value={healthy} color="text-emerald-400" delay="stagger-2" />
          <StatCard label="Late"    value={late}    color="text-amber-400"   delay="stagger-3" />
          <StatCard label="Down"    value={down}    color="text-red-400"     delay="stagger-4" />
        </div>
      )}

      {/* Alerts banner if any down */}
      {down > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fadeInUp">
          <XCircle size={16} className="shrink-0" />
          <span>
            <strong>{down}</strong> job{down > 1 ? 's are' : ' is'} currently <strong>DOWN</strong> — alerts have been sent.
          </span>
        </div>
      )}

      {late > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm animate-fadeInUp">
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            <strong>{late}</strong> job{late > 1 ? 's are' : ' is'} <strong>Late</strong> — pings haven't arrived in time.
          </span>
        </div>
      )}

      {healthy === total && total > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-fadeInUp">
          <CheckCircle size={16} className="shrink-0" />
          All systems operational.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-40 animate-pulse_soft bg-surface-200" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-red-400 text-sm">Failed to connect to the API.</p>
          <button onClick={() => refetch()} className="btn-ghost">Retry</button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && total === 0 && (
        <EmptyState onCreateClick={() => setShowModal(true)} />
      )}

      {/* Job grid */}
      {!isLoading && !isError && total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs!.map((job: Job, i: number) => (
            <div
              key={job._id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}

      {showModal && <CreateJobModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
