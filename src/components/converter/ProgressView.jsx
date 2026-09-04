import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressView({ progress = 0, statusText = 'Processing conversion…' }) {
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 font-bold text-[#161618] truncate">
          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
          <span className="truncate">{statusText}</span>
        </span>
        <span className="font-mono text-xs font-black text-blue-600 shrink-0">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-[#E4E4E7] rounded-full overflow-hidden p-0.5 border border-black/5 shadow-inner">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}
