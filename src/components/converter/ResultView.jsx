import React from 'react';
import { Download, CheckCircle2, AlertTriangle, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export default function ResultView({
  file,
  onRetry,
  onDelete
}) {
  const isDone = file.status === 'done';
  const isError = file.status === 'error';

  if (isError) {
    return (
      <div className="space-y-3 py-1">
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 truncate">
            <span className="font-extrabold block">Conversion Failed</span>
            <p className="text-[11px] text-rose-700 leading-snug break-words">
              {file.error || 'The passage process encountered an unexpected issue.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onRetry();
              }}
              className="avero-dark-glossy text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Passage</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-xl text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors"
              title="Delete failed item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-1">
      <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
        <div className="flex items-center gap-2 truncate">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="truncate">
            <span className="font-extrabold block truncate">
              {file.outputName || `${file.name.replace(/\.[^/.]+$/, '')}.${file.targetFormat}`}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Ready for high-fidelity export
            </span>
          </div>
        </div>

        <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-700 text-white font-black uppercase shrink-0">
          .{file.targetFormat}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        <div className="flex items-center gap-2">
          {file.downloadUrl && (
            <a
              href={file.downloadUrl}
              download={file.outputName || `${file.name.replace(/\.[^/.]+$/, '')}.${file.targetFormat}`}
              onClick={() => triggerHaptic('success')}
              className="avero-dark-glossy text-white px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          )}

          {file.targetFormat === 'pdf' && file.downloadUrl && (
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="avero-light-glossy text-[#161618] px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border border-black/5 hover:scale-105 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </a>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
