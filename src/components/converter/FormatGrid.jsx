import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import {
  ApplePagesIcon,
  AppleKeynoteIcon,
  AppleNumbersIcon,
  MicrosoftWordIcon,
  MicrosoftPowerPointIcon,
  MicrosoftExcelIcon,
  AdobePdfIcon
} from '../BrandIcons';
import { triggerHaptic } from '../../utils/haptics';
import { MODES, getCompatibleModes } from '../../config/featuresConfig';

export function getAvailableTargets(sourceFormat = '', activeMode = 'documents') {
  const ext = (sourceFormat || '').toLowerCase().replace(/^\./, '');
  const mode = activeMode || 'documents';

  // 1. Image Files -> Convert to PDF
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(ext)) {
    if (mode === 'utilities' || mode === 'documents') {
      return [
        { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }

  // 2. Microsoft Word / OpenDocument
  if (ext === 'docx' || ext === 'doc') {
    if (mode === 'documents') {
      return [
        { format: 'pages', label: 'Apple Pages', badge: '.pages', Icon: ApplePagesIcon },
        { format: 'pdf', label: 'PDF Layout', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    if (mode === 'utilities') {
      return [
        { format: 'pdf', label: 'PDF Layout', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }

  // 3. Apple Pages
  if (ext === 'pages') {
    if (mode === 'documents') {
      return [
        { format: 'docx', label: 'Microsoft Word', badge: '.docx', Icon: MicrosoftWordIcon },
        { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    if (mode === 'utilities') {
      return [
        { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }

  // 4. PDF Documents: Split cleanly between Office Documents and PDF Power Tools
  if (ext === 'pdf') {
    if (mode === 'documents') {
      return [
        { format: 'pages', label: 'Apple Pages', badge: '.pages', Icon: ApplePagesIcon },
        { format: 'docx', label: 'Microsoft Word', badge: '.docx', Icon: MicrosoftWordIcon }
      ];
    }
    if (mode === 'utilities') {
      return [
        { format: 'compress', label: 'Compress PDF', badge: '-75%', Icon: AdobePdfIcon },
        { format: 'split', label: 'Split Pages', badge: '.zip', Icon: AdobePdfIcon },
        { format: 'rotate', label: 'Rotate 90°', badge: '.pdf', Icon: AdobePdfIcon },
        { format: 'watermark', label: 'Watermark', badge: '.pdf', Icon: AdobePdfIcon },
        { format: 'protect', label: 'Protect Password', badge: '.pdf', Icon: AdobePdfIcon },
        { format: 'ocr', label: 'OCR Searchable', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    // PDF in Spreadsheets or Presentations -> return empty to trigger the Mode Bridge UI!
    return [];
  }

  // 5. Apple Keynote / PowerPoint (Presentations Mode)
  if (ext === 'key') {
    if (mode === 'presentations') {
      return [
        { format: 'pptx', label: 'PowerPoint', badge: '.pptx', Icon: MicrosoftPowerPointIcon },
        { format: 'pdf', label: 'PDF Slides', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }
  if (ext === 'pptx' || ext === 'ppt') {
    if (mode === 'presentations') {
      return [
        { format: 'key', label: 'Apple Keynote', badge: '.key', Icon: AppleKeynoteIcon },
        { format: 'pdf', label: 'PDF Slides', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }

  // 6. Apple Numbers / Excel / CSV (Spreadsheets Mode)
  if (ext === 'numbers') {
    if (mode === 'spreadsheets') {
      return [
        { format: 'xlsx', label: 'Microsoft Excel', badge: '.xlsx', Icon: MicrosoftExcelIcon },
        { format: 'csv', label: 'CSV Table', badge: '.csv', Icon: MicrosoftExcelIcon },
        { format: 'pdf', label: 'PDF Canvas', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    if (mode === 'spreadsheets') {
      return [
        { format: 'numbers', label: 'Apple Numbers', badge: '.numbers', Icon: AppleNumbersIcon },
        { format: 'pdf', label: 'PDF Layout', badge: '.pdf', Icon: AdobePdfIcon }
      ];
    }
    return [];
  }

  // Default fallback
  return [
    { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
  ];
}

export default function FormatGrid({
  sourceFormat = '',
  selectedTarget = '',
  onSelectTarget,
  activeMode = 'documents',
  onChangeMode
}) {
  const targets = getAvailableTargets(sourceFormat, activeMode);
  const compatibleModes = getCompatibleModes(sourceFormat);
  const currentModeConfig = MODES[activeMode] || MODES.documents;

  // Auto-sync selected target if current target is invalid for this mode
  useEffect(() => {
    if (targets.length > 0) {
      const isTargetValid = targets.some((t) => t.format === selectedTarget);
      if (!isTargetValid && onSelectTarget) {
        onSelectTarget(targets[0].format);
      }
    }
  }, [targets, selectedTarget, onSelectTarget]);

  // If active mode is incompatible with this document, render the Smart Incompatibility Bridge
  if (targets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-2xs space-y-3"
      >
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-200/70 text-amber-900 shrink-0 mt-0.5">
            <Compass className="w-4 h-4 text-amber-800" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-black text-amber-950 block">
              .{sourceFormat.toUpperCase()} is not a {currentModeConfig.name.toLowerCase().replace(/s$/, '')} file
            </span>
            <p className="text-[11px] text-amber-800 leading-snug">
              Conversion from <span className="font-bold">.{sourceFormat.toLowerCase()}</span> to {currentModeConfig.name} is not a valid format passage. Switch to a supported territory:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
          {compatibleModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onChangeMode && onChangeMode(mode.id);
              }}
              className="avero-dark-glossy text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Switch to {mode.name}</span>
              <ArrowRight className="w-3 h-3 text-white/70" />
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-black text-[#71717A] block tracking-wider">
          Target Passage Format:
        </span>
        {activeMode && (
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50/90 px-2.5 py-0.5 rounded-full border border-blue-200/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Territory: {currentModeConfig.name}</span>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {targets.map((t) => {
          const isSelected = selectedTarget === t.format;
          const TargetIcon = t.Icon;
          return (
            <button
              key={t.format}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onSelectTarget(t.format);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border active:scale-95 cursor-pointer ${
                isSelected
                  ? 'avero-dark-glossy text-white border-white/20 shadow-md scale-[1.02]'
                  : 'avero-light-glossy text-[#161618] border-black/5 hover:scale-[1.02]'
              }`}
            >
              {TargetIcon && <TargetIcon className="w-3.5 h-3.5 shrink-0" />}
              <span>{t.label}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#161618]'
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
