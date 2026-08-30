import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Download, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Sliders, Type, FileCode, Zap } from 'lucide-react';
import { inspectDocument, formatFileSize } from '../utils/fileConverter';
import { sounds } from '../utils/audio';

export default function DocumentInspector({
  file,
  isConverting,
  progress,
  convertedResult,
  onConvert,
  onReset,
  onSelectSample
}) {
  const metrics = inspectDocument(file || { name: 'Quarterly_Strategic_Report.docx', size: 340000 });
  const isTargetPages = metrics.targetType === 'pages';

  return (
    <div className="w-full clean-glass-card rounded-3xl p-6 md:p-8 space-y-6">
      
      {/* Top Document Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${
            metrics.territory === 'paper' 
              ? 'bg-[#E9E4D8] text-[#15161C] border-[#B8AE98]' 
              : 'bg-[#3D8BFD]/20 text-[#3D8BFD] border-[#3D8BFD]/40'
          }`}>
            {metrics.territory === 'paper' ? <FileText className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-base md:text-lg font-bold text-white truncate max-w-sm">
                {file ? file.name : 'Sample_Document.docx'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-slate-300 font-bold">
                {metrics.extension}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {metrics.size} &bull; {metrics.pageCount} Pages &bull; {metrics.wordCount} Words
            </span>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-mono text-slate-400">Sample:</span>
          <button
            onClick={() => { onSelectSample('docx'); sounds.playPaperClick(); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 border border-white/10 transition-colors"
          >
            .docx
          </button>
          <button
            onClick={() => { onSelectSample('pdf'); sounds.playPaperClick(); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 border border-white/10 transition-colors"
          >
            .pdf
          </button>
          <button
            onClick={() => { onSelectSample('pages'); sounds.playPaperClick(); }}
            className="px-2.5 py-1 rounded-lg bg-[#3D8BFD]/20 hover:bg-[#3D8BFD]/30 text-xs font-mono text-[#3D8BFD] border border-[#3D8BFD]/30 transition-colors"
          >
            .pages
          </button>
        </div>
      </div>

      {/* 4-Point Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase block">SOURCE ENGINE</span>
          <p className="text-white font-semibold truncate">{metrics.layoutEngine}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase block">DESTINATION</span>
          <p className="text-[#3D8BFD] font-bold uppercase">{metrics.targetType} PACKAGE</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase block">TYPOGRAPHY AST</span>
          <p className="text-white font-semibold">{metrics.embeddedFonts.join(', ')}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase block">BORDER INTEGRITY</span>
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% LOSSLESS</span>
          </p>
        </div>
      </div>

      {/* Action Zone: Convert or Download */}
      <div className="pt-2">
        {convertedResult ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Border Crossing Completed!
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
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/90 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-glass-glow active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download {metrics.targetType.toUpperCase()}</span>
              </a>

              <button
                onClick={() => { onReset(); sounds.playPaperClick(); }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                title="Convert another document"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isConverting ? (
          <div className="p-5 rounded-2xl bg-[#E8A23D]/10 border border-[#E8A23D]/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#E8A23D]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span className="font-semibold">{progress ? progress.statusText : 'Crossing over the seam...'}</span>
              </div>
              <span className="font-bold">{progress ? progress.progressPercent : 0}%</span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#E8A23D] h-full"
                animate={{ width: `${progress ? progress.progressPercent : 0}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                sounds.playGateTransit();
                onConvert();
              }}
              className="w-full flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#E8A23D] to-[#3D8BFD] hover:opacity-95 text-white font-bold font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-[0.99] transition-all"
            >
              <Zap className="w-5 h-5 text-white" />
              <span>Cross the Port Gate &rarr; Convert to {metrics.targetType.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
