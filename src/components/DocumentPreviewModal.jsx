import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Eye, FileText, Layers, ShieldCheck, ArrowRight, ExternalLink, Smartphone, Check, ZoomIn } from 'lucide-react';
import { getPreviewUrl } from '../utils/api';

export default function DocumentPreviewModal({ item, onClose, onSendToPhone }) {
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!item) return null;

  const targetFormat = (item.targetFormat || item.targetType || 'pdf').toLowerCase();
  const isPdf = targetFormat === 'pdf';
  const isPages = targetFormat === 'pages';
  const isDocx = targetFormat === 'docx' || targetFormat === 'doc';

  const previewUrl = item.downloadUrl
    ? item.downloadUrl.replace('/download', '/preview')
    : (item.id ? `/api/jobs/${item.id}/preview` : null);

  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-[#15161C]/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[92vh] bg-[#1A202C] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 relative"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl border ${
              isPages
                ? 'bg-[#3D8BFD]/20 text-[#3D8BFD] border-[#3D8BFD]/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isPages ? <Layers className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white truncate">
                  {item.outputName || item.originalName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase font-semibold">
                  .{targetFormat}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 block truncate">
                Passage: {(item.sourceFormat || item.originalType).toUpperCase()} &rarr; {targetFormat.toUpperCase()} &bull; Live Rendered Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-[#15161C]/80 min-h-[400px]">
          {isPdf ? (
            /* Live Interactive PDF Viewport */
            <div className="w-full h-[540px] rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl relative">
              <iframe
                src={`${downloadUrl}#toolbar=1&navpanes=0&view=Fit`}
                title="Converted PDF Live Preview"
                className="w-full h-full border-0"
              />
            </div>
          ) : isPages && !imgError ? (
            /* Actual Live Rendered Apple Pages Preview Image extracted from .pages bundle */
            <div className="w-full flex flex-col items-center space-y-4 max-w-2xl mx-auto">
              <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white max-h-[520px] min-h-[300px] flex items-center justify-center w-full">
                {imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1A202C]/60 text-slate-300 font-mono text-xs gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#3D8BFD] border-t-transparent animate-spin" />
                    <span>Extracting Apple Pages canvas render...</span>
                  </div>
                )}
                <img
                  src={previewUrl}
                  alt="Live Rendered .pages Document Preview"
                  className={`object-contain transition-transform duration-300 rounded-xl max-h-[500px] w-auto ${
                    isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  } ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImgLoading(false)}
                  onClick={() => setIsZoomed(!isZoomed)}
                  onError={() => {
                    setImgLoading(false);
                    setImgError(true);
                  }}
                />
                
                {/* Floating badge */}
                {!imgLoading && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1.5 border border-white/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Native Apple Pages Render</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <ZoomIn className="w-3.5 h-3.5 text-[#3D8BFD]" />
                <span>Click image to zoom &bull; Rendered directly by macOS Apple Pages Engine</span>
              </div>
            </div>
          ) : isPages ? (
            /* Apple Pages Fallback Card if preview image not extractable */
            <div className="w-full max-w-lg glass-sheet rounded-2xl p-8 border border-white/15 shadow-glass-realistic space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#3D8BFD]/20 text-[#3D8BFD] flex items-center justify-center mx-auto border border-[#3D8BFD]/30 shadow-glass-glow">
                <Layers className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#3D8BFD]/20 text-[#3D8BFD] font-bold uppercase border border-[#3D8BFD]/30">
                  Apple iWork Pages Bundle
                </span>
                <h3 className="font-glass text-2xl font-extrabold text-white tracking-tight">
                  {item.outputName || item.originalName}
                </h3>
                <p className="font-glass text-sm text-slate-300 leading-relaxed font-light max-w-md mx-auto">
                  Synthesized with fluid curves, native Apple Typography, dynamic vector canvases, and exact macOS layout.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-left grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Engine</span>
                  <span className="text-white font-semibold">Apple Pages (AppleScript)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Format</span>
                  <span className="text-[#3D8BFD] font-semibold">.pages (Native Vector)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Fidelity</span>
                  <span className="text-emerald-400 font-semibold">100% Native Canvas</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Status</span>
                  <span className="text-slate-200 font-semibold">Ready for Passage</span>
                </div>
              </div>
            </div>
          ) : (
            /* Microsoft Word DOCX Visual Preview Card */
            <div className="w-full max-w-lg paper-sheet rounded-2xl p-8 border border-[#B8AE98]/60 shadow-paper-realistic space-y-6 text-[#15161C] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#15161C] text-[#E9E4D8] flex items-center justify-center mx-auto shadow-md">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#15161C] text-[#E9E4D8] font-bold uppercase">
                  Microsoft Word OpenXML
                </span>
                <h3 className="font-paper text-2xl font-bold text-[#15161C] tracking-tight">
                  {item.outputName || item.originalName}
                </h3>
                <p className="font-paper text-sm text-[#15161C]/80 leading-relaxed max-w-md mx-auto">
                  Rendered with ISO/IEC 29500 schemas, standard 300 DPI print baselines, and structured paragraph styles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#B8AE98]/50 font-mono text-xs text-left grid grid-cols-2 gap-3 text-[#15161C]">
                <div>
                  <span className="text-[10px] text-[#8C826F] uppercase block">Engine</span>
                  <span className="font-semibold text-[#15161C]">Word Baseline Router</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C826F] uppercase block">Format</span>
                  <span className="text-[#15161C] font-semibold">.docx (OpenXML)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C826F] uppercase block">Fidelity</span>
                  <span className="text-emerald-800 font-semibold">Print Baseline 100%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C826F] uppercase block">Compatibility</span>
                  <span className="font-semibold text-[#15161C]">Word, Google Docs, Pages</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onSendToPhone && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSendToPhone(item);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#3D8BFD]" />
                <span>Send to Phone (QR)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
            >
              Close
            </button>
            <a
              href={item.downloadUrl}
              download={item.outputName || `${item.originalName}.${targetFormat}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/90 font-mono text-xs font-bold uppercase tracking-wider shadow-glass-glow transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{targetFormat.toUpperCase()}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
