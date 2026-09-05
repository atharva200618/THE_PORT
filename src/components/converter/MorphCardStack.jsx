import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Zap, Trash2, Files, Sparkles, ArrowRight, Layers } from 'lucide-react';
import MorphCard from './MorphCard';
import { triggerHaptic } from '../../utils/haptics';
import { MODES } from '../../config/featuresConfig';
import { AdobePdfIcon } from '../BrandIcons';

export default function MorphCardStack({
  files,
  onSelectTarget,
  onSetPassword,
  onStartConvert,
  onStartAll,
  onMergePdfs,
  onRemoveFile,
  onClearAll,
  onDeleteConversion,
  onOpenFileInput,
  activeMode = 'documents',
  onChangeMode,
  onSelectSample
}) {
  const currentMode = MODES[activeMode] || MODES.documents;
  const idleCount = files.filter((f) => f.status === 'idle').length;
  const pdfFiles = files.filter((f) => f.sourceFormat === 'pdf' && (f.status === 'idle' || f.file));
  const primaryFile = files[0];

  const handlePresetClick = (preset) => {
    triggerHaptic('light');
    if (preset.id === 'merge-pdfs' && onMergePdfs && pdfFiles.length >= 2) {
      onMergePdfs();
      return;
    }

    // Check if any idle file matches this preset's expected source extension
    const matchingFile = files.find(
      (f) => f.status === 'idle' && (preset.sourceExt ? f.sourceFormat === preset.sourceExt : true)
    );

    if (matchingFile) {
      onSelectTarget(matchingFile.id, preset.target);
    } else if (onSelectSample) {
      onSelectSample(preset.sample);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      {/* Top Stack Control Bar */}
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#161618] flex items-center gap-1.5">
            <Files className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {files.length} {files.length === 1 ? 'Document' : 'Documents'} in Workspace
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFileInput && (
            <button
              type="button"
              onClick={onOpenFileInput}
              className="avero-light-glossy px-3 py-1.5 rounded-full text-xs font-bold text-[#161618] border border-black/5 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Add File</span>
            </button>
          )}

          {pdfFiles.length >= 2 && onMergePdfs && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onMergePdfs();
              }}
              className="avero-dark-glossy text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-700 border-red-400/30"
              title="Merge all PDF files into a single unified document"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Merge {pdfFiles.length} PDFs</span>
            </button>
          )}

          {idleCount > 1 && onStartAll && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onStartAll();
              }}
              className="avero-dark-glossy text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              <span>Convert All ({idleCount})</span>
            </button>
          )}

          {files.length > 0 && onClearAll && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClearAll();
              }}
              className="p-1.5 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors text-xs font-bold cursor-pointer"
              title="Clear all workspace items"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Feature Tool Ribbon matching activeMode */}
      <div className="avero-clay-card rounded-2xl p-3 bg-white/70 border border-white/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[10px] font-black uppercase text-[#71717A] tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{currentMode.name} Passage Tools:</span>
          </span>
          {onSelectSample && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectSample(currentMode.presets[0]?.sample || 'pages');
              }}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>+ Try {currentMode.shortName} Sample</span>
            </button>
          )}
        </div>

        {/* Quick Mode Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none px-0.5">
          {currentMode.presets.map((preset) => {
            const { SourceIcon, TargetIcon } = preset;
            const isSelected =
              primaryFile &&
              primaryFile.status === 'idle' &&
              (preset.sourceExt ? primaryFile.sourceFormat === preset.sourceExt : true) &&
              primaryFile.targetFormat === preset.target;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs border ${
                  isSelected
                    ? 'avero-dark-glossy text-white border-white/20 shadow-md scale-[1.02]'
                    : 'avero-light-glossy text-[#161618] border-black/5 hover:scale-[1.03] active:scale-95'
                }`}
                title={`Quick Passage: ${preset.label}`}
              >
                {SourceIcon && <SourceIcon className="w-3.5 h-3.5 shrink-0" />}
                <ArrowRight className={`w-2.5 h-2.5 ${isSelected ? 'text-white/70' : 'text-[#71717A]'}`} />
                {TargetIcon && <TargetIcon className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List with Morph Transition on 1st element */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => (
            <MorphCard
              key={file.id}
              file={file}
              isPrimary={index === 0}
              onSelectTarget={onSelectTarget}
              onSetPassword={onSetPassword}
              onStartConvert={onStartConvert}
              onRemove={onRemoveFile}
              onDelete={onDeleteConversion}
              activeMode={activeMode}
              onChangeMode={onChangeMode}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
