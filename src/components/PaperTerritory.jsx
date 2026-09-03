import React from 'react';
import { FileText, FileSpreadsheet, Presentation, Upload, CheckCircle2, AlertTriangle, Sparkles, Lightbulb, Plus, X, Files, Zap, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function PaperTerritory({
  activeFile,
  stagedFiles = [],
  onFileSelect,
  onRemoveStagedFile,
  isSource,
  selectedTargetFormat,
  onChangeTargetFormat,
  onSelectSample,
  onTriggerConvert,
  activeMode = 'documents' // 'documents' | 'spreadsheets' | 'presentations'
}) {
  // Mode-based format filtering
  const acceptedExts = activeMode === 'spreadsheets'
    ? ['xlsx', 'xls', 'csv']
    : activeMode === 'presentations'
    ? ['pptx', 'ppt']
    : ['docx', 'doc', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'];

  const paperStaged = stagedFiles.filter(f => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    return acceptedExts.includes(ext);
  });

  const displayFile = activeFile || (paperStaged.length > 0 ? paperStaged[0] : null);
  const isBatch = paperStaged.length > 1;

  // Single active extension if only 1 file
  const activeExt = displayFile ? (displayFile.name.split('.').pop() || '').toLowerCase() : acceptedExts[0];
  const isImageFile = ['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(activeExt);

  // Determine available target formats dynamically
  let targetOptions = [];
  if (activeMode === 'spreadsheets') {
    targetOptions = [
      { format: 'numbers', label: isBatch ? 'Convert All to Numbers' : 'Convert to Numbers', badge: '.numbers', desc: 'Apple Numbers Table Canvas' },
      { format: 'csv', label: isBatch ? 'Convert All to CSV' : 'Convert to CSV', badge: '.csv', desc: 'Raw Comma-Separated Values' },
      { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Printable PDF Layout' }
    ];
  } else if (activeMode === 'presentations') {
    targetOptions = [
      { format: 'key', label: isBatch ? 'Convert All to Keynote' : 'Convert to Keynote', badge: '.key', desc: 'Apple Keynote Presentation' },
      { format: 'pdf', label: isBatch ? 'Convert All to PDF Slides' : 'Convert to PDF Slides', badge: '.pdf', desc: 'Slide Deck PDF Export' }
    ];
  } else if (isImageFile) {
    targetOptions = [
      { format: 'pdf', label: isBatch ? 'Merge All into 1 PDF' : 'Convert to PDF', badge: '.pdf', desc: 'High-Res Multi-Image PDF Document' }
    ];
  } else {
    // Documents mode
    const docxCount = paperStaged.filter(f => ['docx', 'doc'].includes((f.name.split('.').pop() || '').toLowerCase())).length;
    const pdfCount = paperStaged.filter(f => (f.name.split('.').pop() || '').toLowerCase() === 'pdf').length;
    const isMixedBatch = docxCount > 0 && pdfCount > 0;

    if (isBatch && isMixedBatch) {
      targetOptions = [
        { format: 'pages', label: 'Convert All to Pages', badge: '.pages', desc: 'Universal Target for DOCX + PDF' }
      ];
    } else if (activeExt === 'pdf') {
      targetOptions = [
        { format: 'pages', label: isBatch ? 'Convert All to Pages' : 'Convert to Pages', badge: '.pages', desc: 'Apple Pages Vector Canvas' },
        { format: 'docx', label: isBatch ? 'Convert All to Word' : 'Convert to Word', badge: '.docx', desc: 'Microsoft Word OpenXML' },
        { format: 'compress', label: 'Compress PDF', badge: 'Save 70%', desc: 'Reduce File Size (Lossless Vector)' }
      ];
    } else {
      targetOptions = [
        { format: 'pages', label: isBatch ? 'Convert All to Pages' : 'Convert to Pages', badge: '.pages', desc: 'Apple Pages Vector Canvas' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Printable Document PDF' }
      ];
    }
  }

  const modeDetails = activeMode === 'spreadsheets'
    ? {
        title: 'Excel & CSV Space',
        sub: 'Microsoft Excel (.xlsx, .xls) & CSV Data Tables',
        desc: 'Tabular calculation matrices, formula columns, and structured CSV worksheets.',
        icon: FileSpreadsheet,
        samples: [{ ext: 'xlsx', label: 'Financial_Model.xlsx' }, { ext: 'csv', label: 'Dataset.csv' }]
      }
    : activeMode === 'presentations'
    ? {
        title: 'PowerPoint Space',
        sub: 'Microsoft PowerPoint (.pptx)',
        desc: '16:9 widescreen slide decks, typography animations, and master presentation slides.',
        icon: Presentation,
        samples: [{ ext: 'pptx', label: 'Pitch_Deck.pptx' }]
      }
    : activeMode === 'utilities'
    ? {
        title: 'Images & PDF Tools',
        sub: 'Screenshots, Photos (.png, .jpg, .heic) & PDF Tools',
        desc: 'Multi-screenshot PDF binding, smart PDF compression, and high-res extraction.',
        icon: FileText,
        samples: [{ ext: 'jpg', label: 'Screenshot_Batch.jpg' }, { ext: 'pdf', label: 'Report_Compress.pdf' }]
      }
    : {
        title: 'Word, PDF & Image Space',
        sub: 'Word (.docx), PDF (.pdf), Screenshots & Photos (.png, .jpg)',
        desc: 'Linear typographic documents, OpenXML formatting baselines, and multi-image binders.',
        icon: FileText,
        samples: [{ ext: 'docx', label: 'Document.docx' }, { ext: 'pdf', label: 'Document.pdf' }]
      };

  return (
    <div className={`avero-paper-card rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between select-none text-[#161618] h-full relative overflow-hidden ${isSource ? 'active-stage animate-breath-amber' : ''}`}>
      
      {/* Top Territory Identity */}
      <div className="space-y-3 sm:space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] font-extrabold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>OFFICE TERRITORY</span>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 text-[#71717A] border border-black/5 font-extrabold shadow-2xs">
            {isSource ? (isBatch ? `${paperStaged.length} FILES STAGED` : (displayFile ? 'SOURCE READY' : 'STANDBY')) : 'TARGET SPACE'}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#161618] tracking-tight">
            {modeDetails.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-semibold">
            {modeDetails.sub}
          </p>
        </div>

        <p className="text-xs text-[#71717A] leading-relaxed font-medium">
          {modeDetails.desc}
        </p>

        {/* Quick Sample Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[#71717A] font-extrabold">Sample:</span>
          {modeDetails.samples.map(s => (
            <button
              key={s.ext}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectSample(s.ext);
              }}
              className="avero-light-glossy px-3 py-1.5 rounded-full text-[#161618] text-xs font-extrabold hover:scale-105 active:scale-95 transition-all shadow-2xs inline-flex items-center gap-1"
            >
              <span>+ {s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rendered Document Card / Deep 3D Carved-Out Dropzone */}
      <div className="my-auto py-4 space-y-3">
        {isBatch ? (
          <div className="p-5 rounded-2xl bg-white border border-black/5 shadow-md space-y-3">
            <div className="flex justify-between items-center text-xs text-[#71717A] border-b border-black/5 pb-2">
              <span className="flex items-center gap-1.5 font-extrabold text-[#161618]">
                <Files className="w-3.5 h-3.5 text-amber-600" />
                <span>BATCH STAGED ({paperStaged.length} FILES)</span>
              </span>
              <button
                type="button"
                onClick={() => onRemoveStagedFile('ALL_PAPER')}
                className="text-rose-600 hover:underline uppercase text-[10px] font-extrabold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {paperStaged.map((staged, idx) => {
                const ext = (staged.name.split('.').pop() || '').toLowerCase();
                return (
                  <div
                    key={`${staged.name}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F4F6] text-xs border border-black/5"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-2 py-0.5 rounded-md bg-[#161618] text-white text-[9px] font-black uppercase">
                        {ext}
                      </span>
                      <span className="truncate text-[#161618] font-bold max-w-[170px]">
                        {staged.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveStagedFile(staged.name)}
                      className="p-1 rounded hover:bg-black/5 text-[#71717A] hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : displayFile ? (
          <div className="p-5 rounded-2xl bg-white border border-white shadow-md relative space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#71717A] border-b border-black/5 pb-2">
              <span className="uppercase font-black text-[#161618]">{activeExt} DOCUMENT READY</span>
              {onRemoveStagedFile && (
                <button
                  type="button"
                  onClick={() => onRemoveStagedFile(displayFile.name)}
                  className="p-1 rounded hover:bg-black/5 text-[#71717A] hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-sm font-extrabold text-[#161618] block truncate">
                {displayFile.name}
              </span>
              <p className="text-[11px] text-[#71717A] font-medium">
                Structured with universal schemas and high-fidelity text boundaries.
              </p>
            </div>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Verified Native Vector</span>
              </span>
              <span className="text-[#71717A] font-semibold">Ready for passage</span>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer avero-inset-dropzone rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center min-h-[190px] relative group block">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative border border-white/80 group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/10 animate-radar pointer-events-none" />
              <modeDetails.icon className="w-6 h-6 text-amber-700 stroke-[2.2]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-[#161618]">Drop {acceptedExts.map(e => `.${e}`).join(', ')} Document</p>
              <p className="text-[11px] text-[#71717A] font-medium">Drag file here or click to browse</p>
            </div>
            <input
              type="file"
              multiple
              accept={acceptedExts.map(e => `.${e}`).join(',')}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFileSelect(Array.from(e.target.files));
                  e.target.value = '';
                }
              }}
            />
          </label>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-2">
        {isSource && displayFile && targetOptions.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black text-[#71717A] block tracking-wider">
              {isBatch ? `Convert All ${paperStaged.length} Files:` : `Target Passage Format for .${activeExt}:`}
            </span>
            
            <div className={`grid gap-2.5 ${targetOptions.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {targetOptions.map((opt) => {
                const isSelected = selectedTargetFormat === opt.format || targetOptions.length === 1;
                return (
                  <button
                    key={opt.format}
                    type="button"
                    onClick={() => {
                      onChangeTargetFormat(opt.format);
                      onTriggerConvert(opt.format);
                    }}
                    className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between gap-2 border active:scale-95 shadow-sm ${
                      isSelected
                        ? 'avero-dark-glossy text-white border-white/20 shadow-md'
                        : 'avero-light-glossy text-[#161618] border-black/5 hover:scale-[1.02]'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#161618]'
                    }`}>
                      {opt.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full avero-light-glossy hover:scale-105 active:scale-95 text-[#161618] text-xs font-black shadow-2xs transition-all border border-black/5">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{paperStaged.length > 0 ? `+ Add More Files` : `Select Document`}</span>
            <input
              type="file"
              multiple
              accept={acceptedExts.map(e => `.${e}`).join(',')}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFileSelect(Array.from(e.target.files));
                  e.target.value = '';
                }
              }}
            />
          </label>
        </div>
      </div>

    </div>
  );
}
