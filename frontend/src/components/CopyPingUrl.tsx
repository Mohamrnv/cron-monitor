import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  url: string;
  label?: string;
}

export function CopyPingUrl({ url, label }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {label && <span className="text-xs text-slate-500 shrink-0 w-14">{label}</span>}
      <div className="flex-1 flex items-center gap-2 bg-surface-300 rounded-lg px-3 py-2 border border-white/[0.06] min-w-0">
        <code className="flex-1 text-xs text-slate-300 monospace truncate">{url}</code>
        <button
          onClick={handleCopy}
          className={`shrink-0 p-1 rounded transition-all duration-200
            ${copied
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          title="Copy URL"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}
