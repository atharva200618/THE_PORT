import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ErrorModal({
  isOpen,
  file,
  onCancel,
  onProceed
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#15161C] border border-[#E8A23D]/40 rounded-2xl p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#E8A23D]/10 text-[#E8A23D] border border-[#E8A23D]/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-paper text-xl font-bold text-white">
                  Formatting Warning
                </h3>
                <span className="font-mono text-[11px] text-[#E8A23D]">
                  NON-EDITABLE VECTOR DETECTED
                </span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plain Copy Voice Explanation */}
          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10 font-body text-sm text-slate-200">
            <p>
              This PDF has no editable text, so Pages conversion will lose formatting. Continue anyway?
            </p>
            <p className="font-mono text-xs text-slate-400 pt-2 border-t border-white/5">
              File target: <span className="text-white">{file ? file.name : 'Scanned_Doc.pdf'}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="px-5 py-2.5 rounded-xl text-xs font-body font-semibold bg-[#E8A23D] text-[#15161C] hover:bg-[#E8A23D]/90 transition-all shadow-md active:scale-95"
            >
              Continue Anyway
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
