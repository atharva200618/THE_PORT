import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeftRight, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Layers, 
  RefreshCw, 
  Zap, 
  Hash, 
  ShieldCheck, 
  Command, 
  Upload, 
  FileCheck,
  Cpu
} from 'lucide-react';
import { inspectDocument } from '../utils/fileConverter';
import { sounds } from '../utils/audio';

export default function ThePortStudio({
  file,
  isConverting,
  progress,
  convertedResult,
  direction, // 'paper-to-glass' | 'glass-to-paper'
  onConvert,
  onReset,
  onSelectSample,
  onToggleDirection,
  onOpenFileInput
}) {
  const docTitle = file ? file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ') : "Quarterly Strategic Report";
  const docExt = file ? file.name.split('.').pop().toLowerCase() : "docx";
  const metrics = inspectDocument(file || { name: 'Quarterly_Strategic_Report.docx', size: 340000 });

  return (
    <div className="w-full space-y-8 select-none">
      
      {/* 1. Symmetrical Dual-Stage Arena (Left: Paper Stage | Center: Port Gate | Right: Glass Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT STAGE: PAPER TERRITORY */}
        <div className={`lg:col-span-5 rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between relative overflow-hidden border ${
          direction === 'paper-to-glass'
            ? 'bg-port-surface border-port-paperLine/30 shadow-2xl ring-1 ring-[#E8A23D]/30'
            : 'bg-port-surface/60 border-white/5 opacity-80 hover:opacity-100'
        }`}>
          
          {/* Stage Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#1C1917] flex items-center justify-center font-bold font-serif text-lg shadow-md">
                P
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Paper Territory
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  PRINT GRID &bull; DOCX / PDF
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#FAF7F2]/20 uppercase">
              {direction === 'paper-to-glass' ? 'Source Stage' : 'Target Stage'}
            </span>
          </div>

          {/* Rendered Paper Document Preview Sheet */}
          <div className="my-auto py-2">
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="clean-paper-sheet rounded-xl p-6 shadow-paper-realistic relative flex flex-col justify-between min-h-[300px]"
            >
              {/* Paper Corner Fold */}
              <div className="paper-corner-fold" />

              {/* Top Print Spec */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#8C826F] border-b border-[#D6CEBF] pb-2">
                <span>A4 PRINT DENSITY 300 DPI</span>
                <span>FRAUNCES / SERIF AST</span>
              </div>

              {/* Document Body */}
              <div className="py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1C1917] text-[#FAF7F2] font-bold">
                    PRINT
                  </span>
                  <span className="text-[10px] font-mono text-[#78716C]">
                    DOC_ID: 884-DX
                  </span>
                </div>

                <h4 className="font-serif text-2xl font-bold text-[#1C1917] leading-tight tracking-tight">
                  {docTitle}
                </h4>

                <p className="font-serif text-xs text-[#44403C] leading-relaxed pt-1">
                  Typeset with structured paragraph flow, universal OpenXML baseline grids, and print-calibrated typography.
                </p>

                {/* Print Metrics Chip */}
                <div className="grid grid-cols-3 gap-2 border border-[#D6CEBF] p-2 bg-[#F2EDE2] rounded-md text-[9px] font-mono mt-2">
                  <div>
                    <span className="text-[#78716C] block">WORDS</span>
                    <strong className="text-[#1C1917]">{metrics.wordCount}</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">PAGES</span>
                    <strong className="text-[#1C1917]">{metrics.pageCount}</strong>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">FORMAT</span>
                    <strong className="text-[#1C1917] uppercase">{docExt === 'pages' ? 'docx' : docExt}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Stamp */}
              <div className="pt-2 border-t border-[#D6CEBF] flex items-center justify-between text-[9px] font-mono text-[#78716C]">
                <span>UNIVERSAL STANDARDS</span>
                <span className="border border-[#DC2626]/70 text-[#DC2626] px-1.5 py-0.5 rounded text-[8px] font-bold rotate-[-3deg]">
                  VERIFIED
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stage Footnote */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Flow Engine: ISO OpenXML</span>
            <button
              onClick={() => { onSelectSample('docx'); sounds.playPaperClick(); }}
              className="text-[#F59E0B] hover:underline"
            >
              Load Sample .docx
            </button>
          </div>

        </div>

        {/* CENTER BRIDGE: THE PORT GATE & CROSSING CONTROLS */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 space-y-6 relative">
          
          {/* Glowing Vertical Connector Line (Desktop) */}
          <div className="hidden lg:block absolute inset-y-8 w-[2px] bg-gradient-to-b from-[#FAF7F2]/20 via-[#F59E0B] to-[#3D8BFD]/20 pointer-events-none" />

          {/* The Port Gate Dial */}
          <motion.div
            animate={{
              scale: isConverting ? 1.12 : 1,
              boxShadow: isConverting
                ? '0 0 50px rgba(245, 158, 11, 0.8), inset 0 0 20px rgba(245, 158, 11, 0.4)'
                : '0 0 25px rgba(0, 0, 0, 0.6)'
            }}
            className="w-20 h-28 md:w-24 md:h-36 rounded-full bg-[#131620] border-2 border-[#F59E0B] backdrop-blur-xl flex flex-col items-center justify-between py-3 px-2 z-20 shadow-2xl relative"
          >
            {/* Top Connector Pin */}
            <div className="w-6 h-[2px] bg-[#FAF7F2] rounded-full" />

            <div className="flex flex-col items-center gap-1 text-center">
              {isConverting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="text-[#F59E0B]"
                >
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
              ) : (
                <div className="p-2 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
              )}

              <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#F59E0B]">
                GATE
              </span>
            </div>

            {/* Bottom Connector Pin */}
            <div className="w-6 h-[2px] bg-[#3D8BFD] rounded-full" />
          </motion.div>

          {/* Direction Switcher Button */}
          <button
            onClick={() => { onToggleDirection(); sounds.playPaperClick(); }}
            className="z-20 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Switch Conversion Direction"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Flip Route</span>
          </button>

          {/* Status Text */}
          <div className="text-center space-y-1 z-20">
            <span className="text-[10px] font-mono text-slate-400 block">
              {isConverting ? 'IN TRANSIT...' : 'READY'}
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              {direction === 'paper-to-glass' ? 'Paper &rarr; Glass' : 'Glass &rarr; Paper'}
            </span>
          </div>

        </div>

        {/* RIGHT STAGE: GLASS TERRITORY */}
        <div className={`lg:col-span-5 rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between relative overflow-hidden border ${
          direction === 'glass-to-paper'
            ? 'bg-port-surface border-[#3D8BFD]/30 shadow-2xl ring-1 ring-[#3D8BFD]/30'
            : 'bg-port-surface/60 border-white/5 opacity-80 hover:opacity-100'
        }`}>
          
          {/* Stage Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3D8BFD] text-white flex items-center justify-center font-bold font-sans text-lg shadow-glass-glow">
                G
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-white tracking-wide">
                  Glass Territory
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  APPLE iWORK &bull; PAGES
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#3D8BFD]/20 text-[#3D8BFD] border border-[#3D8BFD]/30 uppercase">
              {direction === 'glass-to-paper' ? 'Source Stage' : 'Target Stage'}
            </span>
          </div>

          {/* Rendered Glass Document Preview Sheet */}
          <div className="my-auto py-2">
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="clean-glass-sheet rounded-2xl p-6 shadow-glass-realistic relative flex flex-col justify-between min-h-[300px] overflow-hidden"
            >
              {/* Top macOS Window Dots */}
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[#3D8BFD] font-bold tracking-wider">iWORK CANVAS ENGINE</span>
              </div>

              {/* Document Body */}
              <div className="py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-[#3D8BFD]/20 text-[#3D8BFD] font-bold border border-[#3D8BFD]/30">
                    PAGES BUNDLE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    CANVAS 14.2
                  </span>
                </div>

                <h4 className="font-sans text-2xl font-extrabold text-white leading-tight tracking-tight">
                  {docTitle}
                </h4>

                <p className="font-sans text-xs text-slate-300 leading-relaxed pt-1">
                  Rendered with fluid vector curves, native macOS backdrop translucency, and Plus Jakarta Sans geometric typography.
                </p>

                {/* Glass Metrics Chip */}
                <div className="grid grid-cols-3 gap-2 border border-white/10 p-2 bg-white/5 rounded-xl text-[9px] font-mono mt-2 backdrop-blur-md">
                  <div>
                    <span className="text-slate-400 block">LAYERS</span>
                    <strong className="text-white">VECTOR 2D</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">BLUR DEPTH</span>
                    <strong className="text-[#3D8BFD]">24 PX</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">FORMAT</span>
                    <strong className="text-[#3D8BFD] uppercase">.pages</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Glass Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NATIVE APPLE FORMAT</span>
                </span>
                <Command className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Stage Footnote */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Engine: Apple iWork Vector</span>
            <button
              onClick={() => { onSelectSample('pages'); sounds.playPaperClick(); }}
              className="text-[#3D8BFD] hover:underline"
            >
              Load Sample .pages
            </button>
          </div>

        </div>

      </div>

      {/* 2. Interactive Action Control Deck */}
      <div className="bg-port-surface border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#F59E0B]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-mono text-base font-bold text-white truncate max-w-sm">
                  {file ? file.name : 'Strategic_Quarterly_Brief.docx'}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 font-bold uppercase">
                  {docExt}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Size: {metrics.size} &bull; Target: <strong className="text-[#3D8BFD] uppercase">{direction === 'paper-to-glass' ? 'pages' : 'docx'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenFileInput}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-slate-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Choose Another File</span>
            </button>
          </div>
        </div>

        {/* Action Button & Progress */}
        <div>
          {convertedResult ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Passage Complete! Converted to {convertedResult.targetType.toUpperCase()}
                  </h4>
                  <span className="text-xs font-mono text-slate-300">
                    {convertedResult.outputName} is ready to download.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={convertedResult.downloadUrl}
                  download={convertedResult.outputName}
                  onClick={() => sounds.playSnap()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/90 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-glass-glow active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {convertedResult.outputName}</span>
                </a>

                <button
                  onClick={() => { onReset(); sounds.playPaperClick(); }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  title="Convert Another File"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isConverting ? (
            <div className="p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#F59E0B]">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{progress ? progress.statusText : 'Crossing the Port Gate...'}</span>
                </div>
                <span className="font-bold">{progress ? progress.progressPercent : 0}%</span>
              </div>

              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#F59E0B] h-full"
                  animate={{ width: `${progress ? progress.progressPercent : 0}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playGateTransit();
                onConvert();
              }}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#E8A23D] to-[#3D8BFD] hover:opacity-95 text-white font-bold font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-[0.99] transition-all"
            >
              <Zap className="w-5 h-5 text-white" />
              <span>
                Cross Over to {direction === 'paper-to-glass' ? 'Apple Pages (.pages)' : 'Word (.docx)'}
              </span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
