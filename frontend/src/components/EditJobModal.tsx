import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useUpdateJob } from '../hooks/useJobs';
import type { Job } from '../types/job';

interface Props {
  job: Job;
  onClose: () => void;
}

type Unit = 'minutes' | 'hours' | 'days';

function toSeconds(value: number, unit: Unit): number {
  if (unit === 'minutes') return value * 60;
  if (unit === 'hours') return value * 3600;
  return value * 86400;
}

function fromSeconds(seconds: number): { value: number; unit: Unit } {
  if (seconds % 86400 === 0) return { value: seconds / 86400, unit: 'days' };
  if (seconds % 3600 === 0) return { value: seconds / 3600, unit: 'hours' };
  return { value: Math.round(seconds / 60), unit: 'minutes' };
}

export function EditJobModal({ job, onClose }: Props) {
  const [name, setName] = useState(job.name);
  
  const expected = fromSeconds(job.expectedIntervalSeconds);
  const [intervalValue, setIntervalValue] = useState(expected.value);
  const [intervalUnit, setIntervalUnit] = useState<Unit>(expected.unit);
  
  const grace = fromSeconds(job.gracePeriodSeconds);
  const [graceValue, setGraceValue] = useState(grace.value);
  const [graceUnit, setGraceUnit] = useState<Unit>(grace.unit);

  const { mutateAsync, isPending } = useUpdateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({
      id: job._id,
      data: {
        name,
        expectedIntervalSeconds: toSeconds(intervalValue, intervalUnit),
        gracePeriodSeconds: toSeconds(graceValue, graceUnit),
      }
    });
    onClose();
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdropIn" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card p-6 animate-modalIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-slate-100">
            Edit Job
          </h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

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
                <span className="animate-pulse_soft">Saving…</span>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
