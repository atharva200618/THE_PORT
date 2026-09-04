import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, RefreshCw, Download, Files, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function MobileActionBar({
  stagedFiles = [],
  isConverting = false,
  activeConversion = null,
  onConvertAll,
  onOpenFileInput,
  activeMode,
  onChangeMode,
  conversions = []
}) {
  const hasStaged = stagedFiles.length > 0;
  const latestDone = conversions.find(c => c.status === 'done');

  return (
    <div className="fixed bottom-3.5 inset-x-3.5 z-50 sm:hidden pointer-events-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="avero-clay-card rounded-full p-1.5 shadow-2xl border-[1.5px] border-white/95 backdrop-blur-2xl flex items-center justify-between gap-2"
      >
        {isConverting ? (
          <div className="w-full py-2.5 px-4 rounded-full avero-dark-glossy text-white flex items-center justify-center gap-2.5 text-xs font-black shadow-md">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400 stroke-[2.5]" />
            <span className="truncate">{activeConversion?.statusText || 'Converting via The Port…'}</span>
          </div>
        ) : hasStaged ? (
          <div className="w-full flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onOpenFileInput();
              }}
              className="avero-light-glossy p-3 rounded-full text-[#161618] shrink-0 active:scale-95 shadow-2xs border border-black/5"
              aria-label="Add More Files"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onConvertAll();
              }}
              className="avero-dark-glossy text-white py-3 px-5 rounded-full text-xs font-black uppercase tracking-wider flex-1 flex items-center justify-center gap-2 shadow-lg active:scale-95 border border-white/20 sheen-container"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Convert {stagedFiles.length} {stagedFiles.length === 1 ? 'File' : 'Files'} Now</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between gap-2">
            {/* Quick Mobile Mode Pill */}
            <div className="flex items-center p-0.5 rounded-full avero-inset-bar text-[11px] font-black shrink-0">
              {[
                { id: 'documents', label: 'Doc' },
                { id: 'spreadsheets', label: 'Sheet' },
                { id: 'presentations', label: 'Slide' },
                { id: 'utilities', label: 'Tools' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onChangeMode(m.id);
                  }}
                  className={`px-2 py-1 rounded-full transition-all uppercase text-[10px] cursor-pointer ${
                    activeMode === m.id
                      ? 'bg-white text-[#161618] shadow-sm font-black'
                      : 'text-[#71717A]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Primary Action */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onOpenFileInput();
              }}
              className="avero-dark-glossy text-white py-2.5 px-4 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 border border-white/20 ml-auto sheen-container"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Select</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
