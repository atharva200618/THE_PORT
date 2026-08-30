import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowDown, FileText, Layers, RefreshCw, Zap } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function TheGate({
  isDraggingOver,
  isConverting,
  animatingFile,
  onGateClick,
  reducedMotion = false
}) {
  const handleClick = (e) => {
    triggerHaptic('medium');
    if (onGateClick) onGateClick(e);
  };

  return (
    <div
      onClick={handleClick}
      className="relative z-30 flex items-center justify-center cursor-pointer group select-none focus:outline-none py-2"
      role="button"
      tabIndex={0}
      aria-label="The Gate Drop Zone"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Background Kinetic Energy Rings (Active on Hover / Converting) */}
      <div className={`absolute -inset-3 rounded-full transition-opacity duration-500 pointer-events-none ${
        isConverting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-500/30 to-emerald-500/25 animate-gate-halo blur-lg" />
      </div>

      {/* The Gate 3D Soft Clay Power Capsule */}
      <motion.div
        animate={{
          scale: isDraggingOver ? 1.12 : isConverting ? 1.05 : 1,
          boxShadow: isDraggingOver || isConverting
            ? '0 20px 45px rgba(37, 99, 235, 0.35), inset 0 2px 2px #FFFFFF'
            : '8px 16px 28px -2px rgba(0,0,0,0.12), inset 0 2px 2px #FFFFFF'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative z-40 rounded-full flex flex-col items-center justify-between p-3.5 md:p-4.5
          bg-[#ECECEF] border-[1.5px] border-white/95 transition-all duration-300
          ${isDraggingOver ? 'ring-4 ring-blue-500/30' : 'group-hover:scale-105'}
          w-18 h-32 md:w-22 md:h-40 shadow-clay-card`}
      >
        {/* Top Torii Badge */}
        <div className="w-7 h-7 rounded-full bg-[#1E1E22] text-white flex items-center justify-center text-xs shadow-md border border-white/20">
          ⛩️
        </div>

        {/* Center Kinetic Core */}
        <div className="flex flex-col items-center justify-center text-center space-y-1">
          {isConverting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="text-blue-600 drop-shadow-md"
            >
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-[#161618] group-hover:bg-[#1E1E22] group-hover:text-white transition-all">
              <span className="hidden md:inline">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span className="inline md:hidden">
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>
          )}

          <span className="text-[10px] md:text-[11px] tracking-wider uppercase font-black text-[#161618]">
            GATE
          </span>

          <span className="text-[8px] md:text-[9px] text-[#71717A] leading-tight font-extrabold">
            {isDraggingOver ? 'DROP' : isConverting ? 'PASSING' : 'PASSAGE'}
          </span>
        </div>

        {/* Bottom Emerald Status Dot */}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </motion.div>

      {/* 600ms Choreographed Morph Pass-Through Sequence */}
      <AnimatePresence>
        {animatingFile && (
          <motion.div
            key="morph-card"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : animatingFile.direction === 'paper-to-glass'
                ? { x: -180, scale: 0.85, opacity: 0 }
                : { x: 180, scale: 0.85, opacity: 0 }
            }
            animate={
              reducedMotion
                ? { opacity: [0, 1, 0] }
                : {
                    x: [
                      animatingFile.direction === 'paper-to-glass' ? -180 : 180,
                      0,
                      animatingFile.direction === 'paper-to-glass' ? 180 : -180
                    ],
                    scale: [0.85, 1.15, 0.9],
                    opacity: [0, 1, 0]
                  }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.5, 1], ease: 'easeInOut' }}
            className="absolute z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                backgroundColor: ['#FFFFFF', '#1E1E22', '#FFFFFF'],
                borderRadius: ['16px', '24px', '16px'],
                color: ['#161618', '#FFFFFF', '#161618']
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-28 h-36 border border-white p-3 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden avero-clay-card"
            >
              <div className="w-full flex justify-between items-center z-10">
                <span className="text-[9px] font-black truncate max-w-[60px]">
                  {animatingFile.name}
                </span>
                <FileText className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col items-center z-10">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {animatingFile.targetType}
                </span>
              </div>

              <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden z-10">
                <div className="h-full bg-blue-600 w-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
