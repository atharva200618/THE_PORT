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
  onMergePdfs,
  onRemoveFile,
  onClearAll,
  onDeleteConversion,
  onOpenFileInput,
  activeMode = 'documents',
  onChangeMode
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
            activeMode={activeMode}
          />
        ) : (
          <MorphCardStack
            key="cardstack"
            files={files}
            onSelectTarget={onSelectTarget}
            onStartConvert={onStartConvert}
            onStartAll={onStartAll}
            onMergePdfs={onMergePdfs}
            onRemoveFile={onRemoveFile}
            onClearAll={onClearAll}
            onDeleteConversion={onDeleteConversion}
            onOpenFileInput={onOpenFileInput}
            activeMode={activeMode}
            onChangeMode={onChangeMode}
            onSelectSample={onSelectSample}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
