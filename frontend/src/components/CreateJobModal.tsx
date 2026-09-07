import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCreateJob } from '../hooks/useJobs';
import { CopyPingUrl } from './CopyPingUrl';
import { getPingUrl } from '../api/jobsApi';
import type { Job } from '../types/job';

interface Props {
  onClose: () => void;
}

type Unit = 'minutes' | 'hours' | 'days';

function toSeconds(value: number, unit: Unit): number {
  if (unit === 'minutes') return value * 60;
  if (unit === 'hours') return value * 3600;
  return value * 86400;
}

export function CreateJobModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<Unit>('hours');
  const [graceValue, setGraceValue] = useState(5);
  const [graceUnit, setGraceUnit] = useState<Unit>('minutes');
  const [createdJob, setCreatedJob] = useState<Job | null>(null);

  const { mutateAsync, isPending } = useCreateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const job = await mutateAsync({
      name,
      expectedIntervalSeconds: toSeconds(intervalValue, intervalUnit),
      gracePeriodSeconds: toSeconds(graceValue, graceUnit),
    });
    setCreatedJob(job);
  };

  const unitSelect = (value: Unit, onChange: (v: Unit) => void) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value as Unit)}
      className="input-field w-auto"
    >
      <option value="minutes">minutes</option>
      <option value="hours">hours</option>
      <option value="days">days</option>
    </select>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card p-6 animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-slate-100">
            {createdJob ? 'Job Created' : 'New Monitored Job'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {createdJob ? (
          /* Success state — show ping URLs */
          <div className="flex flex-col gap-5">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              ✓ <strong>{createdJob.name}</strong> is now being monitored. Copy the ping URL and add it to your cron job.
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Ping URLs</p>
              <CopyPingUrl url={getPingUrl(createdJob.pingToken)} label="Success" />
              <CopyPingUrl url={getPingUrl(createdJob.pingToken, '/start')} label="Start" />
              <CopyPingUrl url={getPingUrl(createdJob.pingToken, '/fail')} label="Fail" />
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center">
              Done
            </button>
          </div>
        ) : (
          /* Create form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Job Name</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Nightly DB Backup"
                className="input-field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Expected Interval</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  required
                  value={intervalValue}
                  onChange={e => setIntervalValue(Number(e.target.value))}
                  className="input-field w-24"
                />
                {unitSelect(intervalUnit, setIntervalUnit)}
              </div>
              <p className="text-xs text-slate-600">How often should this job ping?</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Grace Period <span className="text-slate-600">(optional)</span></label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={graceValue}
                  onChange={e => setGraceValue(Number(e.target.value))}
                  className="input-field w-24"
                />
                {unitSelect(graceUnit, setGraceUnit)}
              </div>
              <p className="text-xs text-slate-600">Extra tolerance before marking as Late/Down.</p>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="btn-primary flex-1 justify-center">
                {isPending ? (
                  <span className="animate-pulse_soft">Creating…</span>
                ) : (
                  <><Plus size={15} /> Create Job</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
