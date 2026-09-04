import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Zap, Trash2, Files } from 'lucide-react';
import MorphCard from './MorphCard';
import { triggerHaptic } from '../../utils/haptics';

export default function MorphCardStack({
  files,
  onSelectTarget,
  onStartConvert,
  onStartAll,
  onRemoveFile,
  onClearAll,
  onDeleteConversion,
  onOpenFileInput
}) {
  const isBatch = files.length > 1;
  const idleCount = files.filter((f) => f.status === 'idle').length;

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
              className="avero-light-glossy px-3 py-1.5 rounded-full text-xs font-bold text-[#161618] border border-black/5 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Add File</span>
            </button>
          )}

          {idleCount > 1 && onStartAll && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onStartAll();
              }}
              className="avero-dark-glossy text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
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
              className="p-1.5 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-black/5 transition-colors text-xs font-bold"
              title="Clear all workspace items"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
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
              onStartConvert={onStartConvert}
              onRemove={onRemoveFile}
              onDelete={onDeleteConversion}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
