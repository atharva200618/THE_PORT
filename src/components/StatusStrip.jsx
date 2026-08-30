import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Link, 
  Check, 
  Trash, 
  QrCode, 
  ExternalLink,
  FileText
} from 'lucide-react';
import { getViewUrl } from '../utils/api';
import QRCodeModal from './QRCodeModal';

export default function StatusStrip({
  conversions,
  activeConversion,
  onClearConversions,
  onDeleteConversion,
  localIp,
  errorMessage,
  onDismissError
}) {
  const [previewItem, setPreviewItem] = useState(null);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = async (item) => {
    const fullUrl = item.downloadUrl?.startsWith('http')
      ? item.downloadUrl
      : `${window.location.origin}${item.downloadUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const getPipelineDetails = (item) => {
    const src = (item.sourceFormat || item.originalType || '').toLowerCase();
    const tgt = (item.targetFormat || item.targetType || '').toLowerCase();

    // Apple Keynote Suite
    if (src === 'key' && tgt === 'pptx') {
      return {
        pipeline: 'Apple Keynote (.key) → PowerPoint (.pptx) via Native Keynote AppleScript Export',
        fidelity: '100% Native fidelity — animations, layouts, and typography directly exported from Keynote.',
        isHeuristic: false
      };
    }
    if (src === 'pptx' && tgt === 'key') {
      return {
        pipeline: 'Microsoft PowerPoint (.pptx) → Apple Keynote (.key) via Native Keynote AppleScript Import',
        fidelity: '100% Exact vector slide canvas import directly inside Keynote engine.',
        isHeuristic: false
      };
    }
    if (src === 'key' && tgt === 'pdf') {
      return {
        pipeline: 'Apple Keynote (.key) → PDF Presentation via Native Keynote AppleScript Export',
        fidelity: '100% Vector PDF slides directly exported from Keynote.',
        isHeuristic: false
      };
    }

    // Apple Numbers Suite
    if (src === 'numbers' && tgt === 'xlsx') {
      return {
        pipeline: 'Apple Numbers (.numbers) → Microsoft Excel (.xlsx) via Native Numbers AppleScript Export',
        fidelity: '100% Native table formulas, multi-sheet structures, and cell formatting.',
        isHeuristic: false
      };
    }
    if ((src === 'xlsx' || src === 'xls' || src === 'csv') && tgt === 'numbers') {
      return {
        pipeline: `${src.toUpperCase()} → Apple Numbers (.numbers) via Native Numbers AppleScript Import`,
        fidelity: '100% Exact canvas layout and interactive formula import in Numbers.',
        isHeuristic: false
      };
    }
    if (src === 'numbers' && (tgt === 'csv' || tgt === 'pdf')) {
      return {
        pipeline: `Apple Numbers (.numbers) → ${tgt.toUpperCase()} via Native Numbers AppleScript Export`,
        fidelity: '100% Exact structured tabular export.',
        isHeuristic: false
      };
    }

    // Apple Pages Suite
    if (src === 'pdf' && tgt === 'pages') {
      return {
        pipeline: 'PDF → DOCX (pdf2docx) → Apple Pages (AppleScript)',
        fidelity: 'High (95-98%) for text & resumes; multi-column tables may have minor spacing shifts.',
        isHeuristic: true
      };
    }
    if (src === 'pdf' && tgt === 'docx') {
      return {
        pipeline: 'PDF → DOCX (pdf2docx vector reconstruction)',
        fidelity: 'High for structured text; complex borderless tables may require minor tuning.',
        isHeuristic: true
      };
    }
    if (src === 'docx' && tgt === 'pages') {
      return {
        pipeline: 'Microsoft Word → Apple Pages (Native AppleScript Open & Save)',
        fidelity: '100% Native fidelity — styles, fonts, and tables directly imported into iWork canvas.',
        isHeuristic: false
      };
    }
    if (src === 'pages') {
      return {
        pipeline: `Apple Pages (.pages) → ${tgt.toUpperCase()} (Native AppleScript Export)`,
        fidelity: '100% Exact layout & typography export directly from Pages.app.',
        isHeuristic: false
      };
    }
    return {
      pipeline: `${src.toUpperCase()} → ${tgt.toUpperCase()} via The Port Engine`,
      fidelity: 'Standard high-fidelity passage.',
      isHeuristic: false
    };
  };

  return (
    <section className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* QR Code Phone Modal */}
      {qrModalItem && (
        <QRCodeModal
          item={qrModalItem}
          localIp={localIp}
          onClose={() => setQrModalItem(null)}
        />
      )}

      {/* Specific Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onDismissError}
            className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 text-[10px] uppercase font-bold shadow-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${
            activeConversion ? 'bg-[#E8A23D] animate-ping' : 'bg-emerald-500'
          }`} />
          <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold">
            Passage Status //
          </span>
          <span className={`text-xs font-bold ${
            activeConversion ? 'text-[#E8A23D]' : 'text-[#161618]'
          }`}>
            {activeConversion 
              ? activeConversion.statusText || 'Crossing over…'
              : (conversions.length > 0 ? 'Passage Ready' : 'Standby')}
          </span>
        </div>

        {activeConversion && (
          <div className="flex items-center gap-3 min-w-[200px]">
            <Sparkles className="w-4 h-4 text-[#E8A23D] animate-spin" />
            <div className="flex-1 bg-black/10 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#1E1E22] h-full"
                animate={{ width: `${activeConversion.progressPercent || 50}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-[#161618] font-bold">
              {activeConversion.progressPercent || 50}%
            </span>
          </div>
        )}

        {conversions.length > 0 && !activeConversion && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {conversions.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  conversions.forEach((item, index) => {
                    setTimeout(() => {
                      const link = document.createElement('a');
                      link.href = item.downloadUrl;
                      link.download = item.outputName || `${item.originalName}.${item.targetFormat || item.targetType}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, index * 350);
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E1E22] text-white text-xs font-bold shadow-md hover:bg-black transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All ({conversions.length} Files)</span>
              </button>
            )}

            <button
              onClick={onClearConversions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Results List */}
      {conversions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-2">
            Completed Passages ({conversions.length})
          </h3>

          <AnimatePresence>
            {conversions.map((item) => {
              const isCopied = copiedId === item.id;
              const targetFormat = (item.targetFormat || item.targetType || '').toLowerCase();
              const isPdf = targetFormat === 'pdf';
              const isDocx = targetFormat === 'docx' || targetFormat === 'doc';

              const fullDownloadUrl = item.downloadUrl?.startsWith('http')
                ? item.downloadUrl
                : `${window.location.origin}${item.downloadUrl}`;

              const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullDownloadUrl)}`;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="avero-clay-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-[#161618] truncate block max-w-[200px] sm:max-w-xs md:max-w-md">
                          {item.originalName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-[#71717A] font-extrabold shadow-2xs border border-black/5">
                          {item.originalSize || 'Converted'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#71717A] mt-1 font-semibold">
                        <span className="uppercase text-[#161618] font-black">{item.sourceFormat || item.originalType}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
                        <span className="uppercase text-blue-600 font-black">{item.targetFormat || item.targetType}</span>
                        <span className="text-slate-400">• {item.timestamp || 'Just now'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                    
                    {/* Send to Phone via QR Code Button */}
                    <button
                      type="button"
                      onClick={() => setQrModalItem(item)}
                      className="avero-light-glossy inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[#161618] text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all border border-black/5"
                      title="Scan QR Code to Download on Phone"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>To Phone</span>
                    </button>

                    {/* Open PDF in New Tab */}
                    {isPdf && (
                      <a
                        href={getViewUrl(item.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="avero-light-glossy inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[#161618] text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all border border-black/5"
                        title="Open and view PDF directly in browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Open PDF</span>
                      </a>
                    )}

                    {/* Open DOCX in Google Docs */}
                    {isDocx && (
                      <a
                        href={googleDocsViewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="avero-light-glossy inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[#161618] text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all border border-black/5"
                        title="Open and preview DOCX in Google Docs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>View in Docs</span>
                      </a>
                    )}

                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-extrabold transition-all active:scale-95 shadow-2xs ${
                        isCopied
                          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                          : 'avero-light-glossy text-[#161618] border border-black/5 hover:scale-105'
                      }`}
                      title="Copy Shareable Download Link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Link className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{isCopied ? 'Copied' : 'Link'}</span>
                    </button>

                    {/* Fidelity Inspection */}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="avero-light-glossy inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[#161618] text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all border border-black/5"
                      title="Inspect Conversion Fidelity"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fidelity</span>
                    </button>

                    {/* Immediate Delete */}
                    {onDeleteConversion && (
                      <button
                        type="button"
                        onClick={() => onDeleteConversion(item.id)}
                        className="p-2 rounded-full bg-white text-slate-400 hover:text-rose-600 border border-black/5 shadow-2xs transition-all hover:scale-105 active:scale-95"
                        title="Delete from Server Immediately"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Primary Download Button */}
                    <a
                      href={item.downloadUrl}
                      download={item.outputName || `${item.originalName}.${item.targetFormat || item.targetType}`}
                      className="avero-dark-glossy text-white inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/20 hover:scale-[1.03]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .{(item.targetFormat || item.targetType || 'pages').toUpperCase()}</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Fidelity Inspection Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg clay-card rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-[#161618] relative border border-white"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#161618]">
                  Passage Fidelity Inspection
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#71717A] hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-black/5 space-y-1 shadow-sm">
                <span className="text-[10px] text-[#71717A] uppercase font-bold">Document Passage</span>
                <div className="flex items-center gap-2 text-sm font-bold text-[#161618]">
                  <span className="truncate">{previewItem.originalName}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 uppercase">.{previewItem.targetFormat || previewItem.targetType}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#71717A] uppercase font-bold">Engine Routing Pipeline</span>
                <p className="p-3 rounded-2xl bg-white border border-black/5 text-[#161618] shadow-sm">
                  {getPipelineDetails(previewItem).pipeline}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#71717A] uppercase font-bold">Fidelity & Structure Assessment</span>
                <p className="p-3 rounded-2xl bg-white border border-black/5 text-[#71717A] leading-relaxed shadow-sm">
                  {getPipelineDetails(previewItem).fidelity}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-black/5">
              <button
                type="button"
                onClick={() => {
                  const item = previewItem;
                  setPreviewItem(null);
                  setQrModalItem(item);
                }}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#161618] text-xs font-semibold border border-black/5 shadow-sm flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Send to Phone</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#71717A] hover:bg-black/5"
                >
                  Close
                </button>
                <a
                  href={previewItem.downloadUrl}
                  download={previewItem.outputName || `${previewItem.originalName}.${previewItem.targetFormat || previewItem.targetType}`}
                  onClick={() => setPreviewItem(null)}
                  className="glossy-dark-btn text-white inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}
