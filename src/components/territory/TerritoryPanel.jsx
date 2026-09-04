import React from 'react';
import { Plus, X, Files, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export default function TerritoryPanel({
  config,
  activeFile,
  stagedFiles = [],
  onFileSelect,
  onRemoveStagedFile,
  isSource,
  selectedTargetFormat,
  onChangeTargetFormat,
  onSelectSample,
  onTriggerConvert,
  activeMode = 'documents'
}) {
  const acceptedExts = config.getAcceptedExtensions(activeMode);

  const territoryStaged = stagedFiles.filter((f) => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    return acceptedExts.includes(ext);
  });

  const displayFile = activeFile || (territoryStaged.length > 0 ? territoryStaged[0] : null);
  const isBatch = territoryStaged.length > 1;

  // Single active extension if only 1 file
  const activeExt = displayFile ? (displayFile.name.split('.').pop() || '').toLowerCase() : acceptedExts[0];

  // Dynamic target options per mode
  const targetOptions = config.getTargetOptions({
    mode: activeMode,
    stagedFiles: territoryStaged,
    isBatch,
    activeExt
  });

  const modeDetails = config.getModeDetails(activeMode);
  const ModeIcon = modeDetails.icon;
  const SingleCardIcon = config.singleCard.footerIcon || CheckCircle2;

  return (
    <div
      className={`${config.cardClassName} rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between select-none text-[#161618] h-full relative overflow-hidden ${
        isSource ? config.activeStageClass : ''
      }`}
    >
      {/* Top Territory Identity */}
      <div className="space-y-3 sm:space-y-3.5">
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold shadow-2xs ${config.badge.containerClass}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${config.badge.dotClass}`} />
            <span>{config.badge.label}</span>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 text-[#71717A] border border-black/5 font-extrabold shadow-2xs">
            {isSource ? (isBatch ? `${territoryStaged.length} FILES STAGED` : (displayFile ? 'SOURCE READY' : 'STANDBY')) : 'TARGET SPACE'}
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
          {modeDetails.samples.map((s) => (
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
                <Files className={`w-3.5 h-3.5 ${config.batch.iconColor}`} />
                <span>{config.batch.formatTitle(territoryStaged.length, acceptedExts)}</span>
              </span>
              <button
                type="button"
                onClick={() => onRemoveStagedFile(config.batch.clearArg)}
                className="text-rose-600 hover:underline uppercase text-[10px] font-extrabold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {territoryStaged.map((staged, idx) => {
                const ext = (staged.name.split('.').pop() || '').toLowerCase();
                return (
                  <div
                    key={`${staged.name}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F4F6] text-xs border border-black/5"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${config.batch.badgeClass}`}>
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
              <span className="uppercase font-black text-[#161618]">
                {config.singleCard.headerTitle(activeExt)}
              </span>
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
                {config.singleCard.description}
              </p>
            </div>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
              <span className={`flex items-center gap-1.5 font-extrabold ${config.singleCard.footerTextClass}`}>
                <SingleCardIcon className={`w-4 h-4 stroke-[2.5] ${config.singleCard.footerIconClass}`} />
                <span>{config.singleCard.footerLabel}</span>
              </span>
              <span className="text-[#71717A] font-semibold">Ready for passage</span>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer avero-inset-dropzone rounded-2xl p-6 text-center space-y-3 flex flex-col items-center justify-center min-h-[190px] relative group block">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center relative border border-white/80 group-hover:scale-105 transition-transform">
              <div className={`absolute inset-0 rounded-2xl animate-radar pointer-events-none ${config.dropzone.radarClass}`} />
              <ModeIcon className={`w-6 h-6 stroke-[2.2] ${config.dropzone.iconColor}`} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-[#161618]">
                {config.dropzone.title(acceptedExts)}
              </p>
              <p className="text-[11px] text-[#71717A] font-medium">
                {config.dropzone.subtitle}
              </p>
            </div>
            <input
              type="file"
              multiple
              accept={acceptedExts.map((e) => `.${e}`).join(',')}
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
              {isBatch ? `Convert All ${territoryStaged.length} Files:` : `Target Passage Format for .${activeExt}:`}
            </span>

            <div
              className={`grid gap-2.5 ${
                targetOptions.length > 2
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : targetOptions.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1'
              }`}
            >
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
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#161618]'
                      }`}
                    >
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
            <span>
              {territoryStaged.length > 0
                ? config.bottomAction.addMoreLabel(acceptedExts)
                : config.bottomAction.selectLabel(acceptedExts)}
            </span>
            <input
              type="file"
              multiple
              accept={acceptedExts.map((e) => `.${e}`).join(',')}
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
