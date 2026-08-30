import React from 'react';
import { Layers, Table, Presentation, Upload, ShieldCheck, Command, Sparkles, Plus, X, Files } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function GlassTerritory({
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
    ? ['numbers']
    : activeMode === 'presentations'
    ? ['key']
    : ['pages'];

  const glassStaged = stagedFiles.filter(f => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    return acceptedExts.includes(ext);
  });

  const displayFile = activeFile || (glassStaged.length > 0 ? glassStaged[0] : null);
  const isBatch = glassStaged.length > 1;

  // Single active extension if only 1 file
  const activeExt = displayFile ? (displayFile.name.split('.').pop() || '').toLowerCase() : acceptedExts[0];

  // Dynamic target options per mode
  const targetOptions = activeMode === 'spreadsheets'
    ? [
        { format: 'xlsx', label: isBatch ? 'Convert All to Excel' : 'Convert to Excel', badge: '.xlsx', desc: 'Microsoft Excel OpenXML' },
        { format: 'csv', label: isBatch ? 'Convert All to CSV' : 'Convert to CSV', badge: '.csv', desc: 'Raw Comma-Separated Values' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Apple Printable PDF' }
      ]
    : activeMode === 'presentations'
    ? [
        { format: 'pptx', label: isBatch ? 'Convert All to PowerPoint' : 'Convert to PowerPoint', badge: '.pptx', desc: 'Microsoft PowerPoint Presentation' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF Slides' : 'Convert to PDF Slides', badge: '.pdf', desc: 'Slide Deck PDF Export' }
      ]
    : [
        { format: 'docx', label: isBatch ? 'Convert All to Word' : 'Convert to Word', badge: '.docx', desc: 'Microsoft Word Document' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Adobe PDF Viewport' }
      ];

  const modeDetails = activeMode === 'spreadsheets'
    ? {
        title: 'Numbers Space',
        sub: 'Apple Numbers (.numbers)',
        desc: 'Interactive multi-table canvases, dynamic financial models, and Apple typography.',
        icon: Table,
        samples: [{ ext: 'numbers', label: 'Company_Budget.numbers' }]
      }
    : activeMode === 'presentations'
    ? {
        title: 'Keynote Space',
        sub: 'Apple Keynote (.key)',
        desc: 'Dynamic cinematic presentations, Apple vector graphics, and keynote decks.',
        icon: Presentation,
        samples: [{ ext: 'key', label: 'Investor_Pitch.key' }]
      }
    : {
        title: 'Pages Space',
        sub: 'Apple Pages (.pages)',
        desc: 'Fluid vector engine with native Apple shapes, typography, and canvas layouts.',
        icon: Layers,
        samples: [{ ext: 'pages', label: 'Document.pages' }]
      };

  return (
    <div className={`avero-glass-card rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between select-none text-[#161618] h-full relative overflow-hidden ${isSource ? 'active-stage animate-breath-sapphire' : ''}`}>
      
      {/* Top Territory Identity */}
      <div className="space-y-3 sm:space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-[11px] font-extrabold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>APPLE IWORK SPACE</span>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 text-[#71717A] border border-black/5 font-extrabold shadow-2xs">
            {isSource ? (isBatch ? `${glassStaged.length} FILES STAGED` : (displayFile ? 'SOURCE READY' : 'STANDBY')) : 'TARGET SPACE'}
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
                <Files className="w-3.5 h-3.5 text-blue-600" />
                <span>BATCH STAGED ({glassStaged.length} .{acceptedExts[0].toUpperCase()} FILES)</span>
              </span>
              <button
                type="button"
                onClick={() => onRemoveStagedFile('ALL_GLASS')}
                className="text-rose-600 hover:underline uppercase text-[10px] font-extrabold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {glassStaged.map((staged, idx) => (
                <div
                  key={`${staged.name}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F4F6] text-xs border border-black/5"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase">
                      {acceptedExts[0].toUpperCase()}
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
              ))}
            </div>
          </div>
        ) : displayFile ? (
          <div className="p-5 rounded-2xl bg-white border border-white shadow-md relative space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#71717A] border-b border-black/5 pb-2">
              <span className="uppercase font-black text-[#161618]">APPLE {activeExt.toUpperCase()} BUNDLE READY</span>
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
                Rendered with native macOS typography, vector shapes, and Apple canvas styling.
              </p>
            </div>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-blue-700 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                <span>Native Apple Silicon Engine</span>
              </span>
              <span className="text-[#71717A] font-semibold">Ready for passage</span>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer avero-inset-dropzone rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center min-h-[190px] relative group block">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative border border-white/80 group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-2xl bg-blue-500/10 animate-radar pointer-events-none" />
              <modeDetails.icon className="w-6 h-6 text-blue-700 stroke-[2.2]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-[#161618]">Drop .{acceptedExts[0]} File</p>
              <p className="text-[11px] text-[#71717A] font-medium">Drag Apple document or click to choose</p>
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
        {isSource && displayFile && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black text-[#71717A] block tracking-wider">
              {isBatch ? `Convert All ${glassStaged.length} Staged Files:` : `Choose Destination for .${activeExt}:`}
            </span>
            
            <div className={`grid gap-2.5 ${targetOptions.length > 2 ? 'grid-cols-1 sm:grid-cols-3' : targetOptions.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {targetOptions.map((opt) => {
                const isSelected = selectedTargetFormat === opt.format;
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
                    <span className="truncate">
                      {isBatch ? `Convert All to ${opt.badge}` : opt.label}
                    </span>
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
            <span>{glassStaged.length > 0 ? `+ Add More .${acceptedExts[0]} Files` : `Select .${acceptedExts[0]} Files`}</span>
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
