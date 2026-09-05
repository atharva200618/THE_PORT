import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Zap, Trash2, Files, Layers, UploadCloud } from 'lucide-react';
import MorphCard from './MorphCard';
import WorkspaceCompanion from './WorkspaceCompanion';
import { triggerHaptic } from '../../utils/haptics';

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
  onFileSelect
}) {
  const idleCount = files.filter((f) => f.status === 'idle').length;
  const pdfFiles = files.filter((f) => f.sourceFormat === 'pdf' && (f.status === 'idle' || f.file));

  return (
    <div className="max-w-6xl mx-auto w-full px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Main Workspace Column (7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Top Stack Control Bar */}
          <div className="flex items-center justify-between gap-2 px-1">
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
                  className="avero-light-glossy px-3 py-1.5 rounded-full text-xs font-bold text-[#161618] border border-black/5 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
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

          {/* Compact Drop-More Target Zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2"
          >
            <label
              className="avero-inset-bar rounded-2xl p-4 border-2 border-dashed border-black/10 hover:border-blue-500/40 hover:bg-white/40 flex items-center justify-center gap-3 cursor-pointer transition-all group block text-center"
            >
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0 && onFileSelect) {
                    triggerHaptic('medium');
                    onFileSelect(Array.from(e.target.files));
                    e.target.value = '';
                  } else if (e.target.files && e.target.files.length > 0 && onOpenFileInput) {
                    onOpenFileInput();
                  }
                }}
              />
              <div className="w-8 h-8 rounded-full bg-white/80 border border-black/5 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                <UploadCloud className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-[#71717A] group-hover:text-[#161618] transition-colors">
                Drop additional documents to queue, or <span className="text-blue-600 underline underline-offset-2 font-black">browse files</span>
              </span>
            </label>
          </motion.div>
        </div>

        {/* Right / Companion Intelligence Column (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <WorkspaceCompanion
            files={files}
            activeMode={activeMode}
            onSelectTarget={onSelectTarget}
            onRemoveFile={onRemoveFile}
            onStartConvert={onStartConvert}
            onClearAll={onClearAll}
          />
        </div>

      </div>
    </div>
  );
}
