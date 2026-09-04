import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { MODES } from '../../config/featuresConfig';

export default function DropZone({
  onFileSelect,
  onSelectSample,
  isDraggingOver = false,
  activeMode = 'documents'
}) {
  const currentMode = MODES[activeMode] || MODES.documents;
  const samplePreset = currentMode.presets[0] || { sample: 'pages' };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Primary Morphing Dropzone Surface */}
      <motion.div
        layoutId="primary-surface"
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="w-full"
      >
        <label
          className={`avero-inset-bar rounded-full px-7 sm:px-9 py-4 sm:py-4.5 flex items-center justify-between gap-4 cursor-pointer transition-all border border-white/40 block ${
            isDraggingOver ? 'ring-2 ring-blue-500 scale-[1.01]' : 'hover:border-white/60'
          }`}
        >
          <input
            type="file"
            multiple
            accept={currentMode.accept || ".docx,.doc,.pdf,.pages,.key,.pptx,.ppt,.numbers,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.bmp,image/*"}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                triggerHaptic('medium');
                onFileSelect(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />

          <div className="flex items-center gap-3 text-[#71717A] text-xs sm:text-base font-medium truncate">
            <span className="truncate">
              {isDraggingOver ? 'Release files…' : currentMode.placeholder}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-block px-4 py-1.5 rounded-full avero-pill-badge text-xs font-bold text-[#161618]">
              Browse
            </span>
            <span className="hidden sm:inline-block px-4 py-1.5 rounded-full avero-pill-badge text-xs font-bold text-[#161618]">
              Batch
            </span>
            <div className="w-9 h-9 rounded-full avero-circle-glossy flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </label>
      </motion.div>

      {/* 2 Prominent 3D Action Buttons */}
      <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
        <label className="cursor-pointer avero-dark-glossy text-white px-8 sm:px-10 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95">
          <span>Select Files</span>
          <input
            type="file"
            multiple
            accept={currentMode.accept || ".docx,.doc,.pdf,.pages,.key,.pptx,.ppt,.numbers,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.bmp,image/*"}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                triggerHaptic('medium');
                onFileSelect(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />
        </label>

        {onSelectSample && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onSelectSample(samplePreset.sample);
            }}
            className="avero-light-glossy text-[#161618] px-8 sm:px-10 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-black/5"
          >
            <Sparkles className="w-4 h-4 text-[#161618]" />
            <span>Try {currentMode.name} Sample</span>
          </button>
        )}
      </div>
    </div>
  );
}
