import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DropZone from './DropZone';
import MorphCardStack from './MorphCardStack';

export default function ConverterSurface({
  files = [],
  onFileSelect,
  onSelectSample,
  isDraggingOver = false,
  onSelectTarget,
  onStartConvert,
  onStartAll,
  onRemoveFile,
  onClearAll,
  onDeleteConversion,
  onOpenFileInput
}) {
  const isEmpty = files.length === 0;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <DropZone
            key="dropzone"
            onFileSelect={onFileSelect}
            onSelectSample={onSelectSample}
            isDraggingOver={isDraggingOver}
          />
        ) : (
          <MorphCardStack
            key="cardstack"
            files={files}
            onSelectTarget={onSelectTarget}
            onStartConvert={onStartConvert}
            onStartAll={onStartAll}
            onRemoveFile={onRemoveFile}
            onClearAll={onClearAll}
            onDeleteConversion={onDeleteConversion}
            onOpenFileInput={onOpenFileInput}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
