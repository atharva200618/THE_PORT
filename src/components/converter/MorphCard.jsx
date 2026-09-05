import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, FileText, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import FormatGrid from './FormatGrid';
import ProgressView from './ProgressView';
import ResultView from './ResultView';
import { triggerHaptic } from '../../utils/haptics';

export default function MorphCard({
  file,
  isPrimary,
  onSelectTarget,
  onSetPassword,
  onStartConvert,
  onRemove,
  onDelete,
  activeMode
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isApple = ['pages', 'key', 'numbers'].includes(file.sourceFormat);
  const cardBorderClass = isApple ? 'border-blue-500/30' : 'border-amber-500/30';
  const isProtectWithoutPassword = file.targetFormat === 'protect' && (!file.password || !file.password.trim());

  const motionProps = isPrimary
    ? {
        layoutId: 'primary-surface',
        transition: { type: 'spring', stiffness: 350, damping: 30 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
        transition: { duration: 0.3 }
      };

  return (
    <motion.div
      {...motionProps}
      className={`avero-clay-card rounded-3xl p-5 sm:p-6 w-full shadow-clay-card border-[1.5px] bg-white/95 backdrop-blur-xl relative overflow-hidden space-y-4 ${cardBorderClass}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-xl bg-[#161618] text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
            {file.sourceFormat}
          </div>
          <div className="truncate">
            <span className="text-sm font-extrabold text-[#161618] block truncate">
              {file.name}
            </span>
            {file.originalSize && (
              <span className="text-[10px] text-[#71717A] font-semibold">
                {file.originalSize}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status Badge */}
          <span
            className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
              file.status === 'converting'
                ? 'bg-blue-100 text-blue-700 animate-pulse'
                : file.status === 'done'
                ? 'bg-emerald-100 text-emerald-800'
                : file.status === 'error'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            {file.status === 'converting' ? 'Crossing…' : file.status}
          </span>

          {file.status !== 'converting' && onRemove && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onRemove(file.id);
              }}
              className="p-1 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Content View based on status */}
      {file.status === 'idle' && (
        <div className="space-y-4">
          <FormatGrid
            sourceFormat={file.sourceFormat}
            selectedTarget={file.targetFormat}
            onSelectTarget={(target) => onSelectTarget(file.id, target)}
            activeMode={activeMode}
          />

          {file.targetFormat === 'protect' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`password-${file.id}`}
                  className="text-[10px] uppercase font-black text-amber-900 tracking-wider flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Set Document Protection Password:</span>
                </label>
                {(!file.password || !file.password.trim()) && (
                  <span className="text-[10px] font-bold text-amber-700 animate-pulse">
                    * Password required
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  id={`password-${file.id}`}
                  type={showPassword ? 'text' : 'password'}
                  value={file.password || ''}
                  onChange={(e) => onSetPassword && onSetPassword(file.id, e.target.value)}
                  placeholder="Enter custom PDF password..."
                  className="w-full text-xs font-semibold px-3 py-2 pr-9 rounded-xl bg-white border border-amber-300 text-[#161618] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-2 p-1 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              disabled={isProtectWithoutPassword}
              onClick={() => {
                triggerHaptic('medium');
                onStartConvert(file.id);
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-md transition-all ${
                isProtectWithoutPassword
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300 shadow-none'
                  : 'avero-dark-glossy text-white hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{file.targetFormat === 'protect' ? 'Protect PDF with Password' : `Convert to .${file.targetFormat}`}</span>
            </button>
          </div>
        </div>
      )}

      {file.status === 'converting' && (
        <ProgressView progress={file.progress} statusText={file.statusText} />
      )}

      {(file.status === 'done' || file.status === 'error') && (
        <ResultView
          file={file}
          onRetry={() => onStartConvert(file.id)}
          onDelete={() => onDelete ? onDelete(file.id) : onRemove(file.id)}
        />
      )}
    </motion.div>
  );
}
