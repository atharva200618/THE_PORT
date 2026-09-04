import React, { useState, useEffect, useRef, useCallback } from 'react';
import LandingPortal from './components/LandingPortal';
import ConverterSurface from './components/converter/ConverterSurface';
import StatusStrip from './components/StatusStrip';
import MobileActionBar from './components/MobileActionBar';
import { useWorkerStatus } from './hooks/useWorkerStatus';
import { useConversionQueue } from './hooks/useConversionQueue';
import { MODES, detectModeFromFile, getTargetForMode } from './config/featuresConfig';
import { ArrowLeft, Plus } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState('documents');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const fileInputRef = useRef(null);

  // 1. Worker Heartbeat & System Health
  const { workerStatus } = useWorkerStatus();

  // 2. Unified Single-State Conversion Queue
  const {
    files,
    setFiles,
    addFiles,
    removeFile,
    clearAll,
    setTargetFormat,
    startConversion,
    startAllConversions,
    mergePdfs,
    deleteConversion,
    selectSample,
    isConverting
  } = useConversionQueue(soundEnabled);

  // Smart Mode Switcher that updates activeMode & adapts idle files' target formats
  const handleModeChange = useCallback((newMode) => {
    setActiveMode(newMode);
    if (setFiles) {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status === 'idle') {
            const newTarget = getTargetForMode(f.sourceFormat, newMode);
            return {
              ...f,
              targetFormat: newTarget,
              outputName: `${f.name.replace(/\.[^/.]+$/, '')}.${newTarget}`
            };
          }
          return f;
        })
      );
    }
  }, [setFiles]);

  // Add files and auto-sync active mode
  const handleAddFilesWithModeSync = useCallback((incoming) => {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    if (list.length > 0) {
      const firstObj = list[0] instanceof File ? list[0] : list[0].file || list[0];
      const firstExt = (firstObj.name?.split('.').pop() || '').toLowerCase();
      const detected = detectModeFromFile(firstExt);
      setActiveMode(detected);
    }
    addFiles(incoming);
  }, [addFiles]);

  // Sample selector with auto mode sync
  const handleSelectSampleWithModeSync = useCallback((format) => {
    const detected = detectModeFromFile(format);
    setActiveMode(detected);
    selectSample(format);
  }, [selectSample]);

  // Global Drag & Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (e.clientX <= 0 || e.clientY <= 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleAddFilesWithModeSync(Array.from(e.dataTransfer.files));
      }
    },
    [handleAddFilesWithModeSync]
  );

  const isWorkspaceActive = files.length > 0;
  const activeConvertingFile = files.find((f) => f.status === 'converting');
  const activeConversion = activeConvertingFile
    ? { statusText: activeConvertingFile.statusText, progressPercent: activeConvertingFile.progress }
    : null;
  const completedOrErrorFiles = files.filter((f) => f.status === 'done' || f.status === 'error');
  const errorFile = files.find((f) => f.status === 'error');

  // Keyboard shortcut listener (Spacebar triggers passage)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isConverting && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (files.some((f) => f.status === 'idle')) {
          startAllConversions();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startAllConversions, isConverting, files]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen bg-[#EAEAEB] text-[#161618] flex flex-col justify-between selection:bg-[#1E1E22] selection:text-white font-sans relative"
    >
      {/* Hidden Global File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".docx,.doc,.pdf,.pages,.key,.pptx,.ppt,.numbers,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.bmp,image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />

      {/* VIEW 1: CLEAN MINIMALIST LANDING PORTAL (When No Files are Staged/Converting) */}
      {!isWorkspaceActive ? (
        <LandingPortal
          onFileSelect={handleAddFilesWithModeSync}
          onSelectSample={handleSelectSampleWithModeSync}
          isDraggingOver={isDraggingOver}
          workerOnline={workerStatus.online}
          activeMode={activeMode}
          onChangeMode={handleModeChange}
        />
      ) : (
        /* VIEW 2: ACTIVE PASSAGE WORKSPACE */
        <div className="flex-1 flex flex-col justify-between w-full relative overflow-hidden">
          {/* Subtle Background Glowing Ambient Orbs for rich depth */}
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-orb-amber pointer-events-none -z-10" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-orb-sapphire pointer-events-none -z-10" />

          {/* Top Header Bar */}
          <header className="px-4 pt-6 max-w-4xl mx-auto w-full">
            <div className="avero-clay-card rounded-full px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-clay-pill border-[1.5px] border-white/95 backdrop-blur-2xl">
              {/* Left Identity & Back to Portal Button */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={clearAll}
                  className="avero-light-glossy hover:scale-105 active:scale-95 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-[#161618] transition-all border border-black/5 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
                  title="Return to Clean Landing Portal"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Portal</span>
                </button>
              </div>

              {/* Mode Selector Pill Navigation */}
              <div className="flex items-center p-1 rounded-full avero-inset-bar text-xs font-extrabold gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleModeChange('documents')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap cursor-pointer ${
                    activeMode === 'documents'
                      ? 'bg-white text-[#161618] shadow-sm'
                      : 'text-[#71717A] hover:text-[#161618]'
                  }`}
                >
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('spreadsheets')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap cursor-pointer ${
                    activeMode === 'spreadsheets'
                      ? 'bg-white text-[#161618] shadow-sm'
                      : 'text-[#71717A] hover:text-[#161618]'
                  }`}
                >
                  <span className="hidden sm:inline">Spreadsheets</span>
                  <span className="sm:hidden">Sheets</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('presentations')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap cursor-pointer ${
                    activeMode === 'presentations'
                      ? 'bg-white text-[#161618] shadow-sm'
                      : 'text-[#71717A] hover:text-[#161618]'
                  }`}
                >
                  <span className="hidden sm:inline">Presentations</span>
                  <span className="sm:hidden">Slides</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('utilities')}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap cursor-pointer ${
                    activeMode === 'utilities'
                      ? 'bg-white text-[#161618] shadow-sm'
                      : 'text-[#71717A] hover:text-[#161618]'
                  }`}
                >
                  <span className="hidden sm:inline">PDF & Tools</span>
                  <span className="sm:hidden">Tools</span>
                </button>
              </div>

              {/* Right Controls (Add Files - NO WRAPPING, single line) */}
              <div className="flex items-center shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="avero-dark-glossy text-white px-3.5 sm:px-4.5 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 border border-white/20 hover:scale-105 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
                  <span className="text-white whitespace-nowrap">Add Files</span>
                </button>
              </div>
            </div>
          </header>

          {/* HERO SECTION: CONVERTER SURFACE */}
          <main className="flex-1 flex flex-col justify-center w-full px-4 py-8">
            <ConverterSurface
              files={files}
              onFileSelect={handleAddFilesWithModeSync}
              onSelectSample={handleSelectSampleWithModeSync}
              isDraggingOver={isDraggingOver}
              onSelectTarget={setTargetFormat}
              onStartConvert={startConversion}
              onStartAll={startAllConversions}
              onMergePdfs={mergePdfs}
              onRemoveFile={removeFile}
              onClearAll={clearAll}
              onDeleteConversion={deleteConversion}
              onOpenFileInput={() => fileInputRef.current?.click()}
              activeMode={activeMode}
              onChangeMode={handleModeChange}
            />
          </main>

          {/* BELOW THE FOLD: STATUS STRIP & RESULTS */}
          {completedOrErrorFiles.length > 0 && (
            <StatusStrip
              conversions={completedOrErrorFiles}
              activeConversion={activeConversion}
              onClearConversions={clearAll}
              onDeleteConversion={deleteConversion}
              localIp={workerStatus.localIp}
              errorMessage={errorFile?.error || null}
              onDismissError={() => {}}
            />
          )}

          {/* STICKY BOTTOM THUMB ACTION BAR FOR MOBILE */}
          <MobileActionBar
            stagedFiles={files.filter((f) => f.status === 'idle')}
            isConverting={isConverting}
            activeConversion={activeConversion}
            onConvertAll={startAllConversions}
            onOpenFileInput={() => fileInputRef.current?.click()}
            activeMode={activeMode}
            onChangeMode={handleModeChange}
            conversions={completedOrErrorFiles}
          />
        </div>
      )}
    </div>
  );
}
