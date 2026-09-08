import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Trash2, Terminal, Edit2 } from 'lucide-react';
import { useJob, useDeleteJob } from '../hooks/useJobs';
import { StatusBadge } from '../components/StatusBadge';
import { CopyPingUrl } from '../components/CopyPingUrl';
import { getPingUrl } from '../api/jobsApi';
import { EditJobModal } from '../components/EditJobModal';

function formatInterval(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  return `${Math.round(seconds / 86400)} days`;
}

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useJob(id!);
  const deleteMutation = useDeleteJob();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${data?.job.name}"? This cannot be undone.`)) return;
    await deleteMutation.mutateAsync(id!);
    navigate('/');
  };

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="h-8 w-32 bg-surface-200 rounded animate-pulse_soft mb-8" />
        <div className="glass-card p-6 h-64 animate-pulse_soft" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 text-center">
        <p className="text-red-400 text-sm mb-4">Job not found.</p>
        <button onClick={() => navigate('/')} className="btn-ghost">← Back</button>
      </main>
    );
  }

  const { job, pings } = data;


  return (
    <main className="max-w-3xl mx-auto px-6 py-10 animate-fadeInUp">
      {/* Back */}
      <button onClick={() => navigate('/')} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft size={15} /> All Jobs
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-100 mb-2">{job.name}</h1>
          <StatusBadge status={job.status} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditModalOpen(true)} className="btn-ghost shrink-0">
            <Edit2 size={14} /> Edit
          </button>
          <button id="delete-job-btn" onClick={handleDelete} className="btn-danger shrink-0" disabled={deleteMutation.isPending}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Expected Interval', value: formatInterval(job.expectedIntervalSeconds) },
          { label: 'Grace Period', value: formatInterval(job.gracePeriodSeconds) },
          { label: 'Last Ping', value: job.lastPingAt ? formatDistanceToNow(new Date(job.lastPingAt), { addSuffix: true }) : 'Never' },
          { label: 'Next Expected', value: job.nextExpectedPingAt ? formatDistanceToNow(new Date(job.nextExpectedPingAt), { addSuffix: true }) : '—' },
          { label: 'Created', value: format(new Date(job.createdAt), 'MMM d, yyyy') },
          { label: 'Last Alert', value: job.lastAlertSentAt ? formatDistanceToNow(new Date(job.lastAlertSentAt), { addSuffix: true }) : 'None' },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card px-4 py-3">
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm text-slate-200 font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Ping URLs */}
      <div className="glass-card p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={14} className="text-slate-500" />
          <h2 className="text-sm font-medium text-slate-300">Ping URLs</h2>
        </div>
        <div className="flex flex-col gap-2">
          <CopyPingUrl url={getPingUrl(job.pingToken)} label="Success" />
          <CopyPingUrl url={getPingUrl(job.pingToken, '/start')} label="Start" />
          <CopyPingUrl url={getPingUrl(job.pingToken, '/fail')} label="Fail" />
        </div>
      </div>

      {/* Ping history */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-medium text-slate-300 mb-4">
          Recent Pings <span className="text-slate-600 font-normal">(last 20)</span>
        </h2>

        {pings.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No pings recorded yet.</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
          {pings.map((ping, i) => (
            <div
              key={ping._id ?? i}
              className="flex items-center justify-between py-2.5 text-sm animate-fadeInUp"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${
                    ping.type === 'fail' ? 'bg-red-500' :
                    ping.type === 'start' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                  <span className="text-slate-400 capitalize">{ping.type ?? 'success'}</span>
                  {ping.sourceIp && (
                    <span className="text-xs text-slate-600 monospace hidden sm:inline">{ping.sourceIp}</span>
                  )}
                </div>
                <span className="text-xs text-slate-600 tabular-nums">
                  {ping.receivedAt ? formatDistanceToNow(new Date(ping.receivedAt), { addSuffix: true }) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditJobModal job={job} onClose={() => setIsEditModalOpen(false)} />
      )}
    </main>
  );
}
