import React from 'react';
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

export function getAvailableTargets(sourceFormat = '') {
  const ext = sourceFormat.toLowerCase().replace(/^\./, '');
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(ext)) {
    return [
      { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'docx' || ext === 'doc') {
    return [
      { format: 'pages', label: 'Apple Pages', badge: '.pages', Icon: ApplePagesIcon },
      { format: 'pdf', label: 'PDF Layout', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'pdf') {
    return [
      { format: 'pages', label: 'Apple Pages', badge: '.pages', Icon: ApplePagesIcon },
      { format: 'docx', label: 'Microsoft Word', badge: '.docx', Icon: MicrosoftWordIcon },
      { format: 'compress', label: 'Compress PDF', badge: '-75%', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'pages') {
    return [
      { format: 'docx', label: 'Microsoft Word', badge: '.docx', Icon: MicrosoftWordIcon },
      { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'key') {
    return [
      { format: 'pptx', label: 'PowerPoint', badge: '.pptx', Icon: MicrosoftPowerPointIcon },
      { format: 'pdf', label: 'PDF Slides', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'pptx' || ext === 'ppt') {
    return [
      { format: 'key', label: 'Apple Keynote', badge: '.key', Icon: AppleKeynoteIcon },
      { format: 'pdf', label: 'PDF Slides', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'numbers') {
    return [
      { format: 'xlsx', label: 'Microsoft Excel', badge: '.xlsx', Icon: MicrosoftExcelIcon },
      { format: 'csv', label: 'CSV Table', badge: '.csv', Icon: MicrosoftExcelIcon },
      { format: 'pdf', label: 'PDF Canvas', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    return [
      { format: 'numbers', label: 'Apple Numbers', badge: '.numbers', Icon: AppleNumbersIcon },
      { format: 'pdf', label: 'PDF Layout', badge: '.pdf', Icon: AdobePdfIcon }
    ];
  }
  return [
    { format: 'pdf', label: 'PDF Document', badge: '.pdf', Icon: AdobePdfIcon },
    { format: 'docx', label: 'Microsoft Word', badge: '.docx', Icon: MicrosoftWordIcon }
  ];
}

export default function FormatGrid({ sourceFormat, selectedTarget, onSelectTarget }) {
  const targets = getAvailableTargets(sourceFormat);

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase font-black text-[#71717A] block tracking-wider">
        Target Passage Format:
      </span>
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
