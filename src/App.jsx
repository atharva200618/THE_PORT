import React, { useState, useEffect, useRef } from 'react';
import LandingPortal from './components/LandingPortal';
import TerritoryPanel from './components/territory/TerritoryPanel';
import { paperConfig, glassConfig } from './components/territory/territoryConfig';
import TheGate from './components/TheGate';
import StatusStrip from './components/StatusStrip';
import MobileActionBar from './components/MobileActionBar';
import { useWorkerStatus } from './hooks/useWorkerStatus';
import { useFileStaging } from './hooks/useFileStaging';
import { useConversionQueue } from './hooks/useConversionQueue';
import { ArrowLeft, Files, Zap, Plus } from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [strictPrivacy, setStrictPrivacy] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Worker Heartbeat & System Health
  const { workerStatus } = useWorkerStatus();

  // 2. File Staging, Drag & Drop, Mode & Territory Detection
  const {
    activeMode,
    setActiveMode,
    stagedFiles,
    setStagedFiles,
    selectedTargetFormat,
    setSelectedTargetFormat,
    isDraggingOver,
    errorMessage,
    setErrorMessage,
    activeFile,
    sourceTerritory,
    getDefaultTargetFormat,
    handleAppendFiles,
    handleRemoveStagedFile,
    handleSelectSample,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileStaging();

  // 3. Conversion Queue Orchestration, Status Polling & Transitions
  const {
    isConverting,
    activeConversion,
    animatingFile,
    conversions,
    setConversions,
    startConversionSequence,
    handleDeleteConversion
  } = useConversionQueue({
    stagedFiles,
    setStagedFiles,
    selectedTargetFormat,
    getDefaultTargetFormat,
    soundEnabled,
    setErrorMessage
  });

  // Determine if Workspace view or Landing Portal is active
  const isWorkspaceActive = stagedFiles.length > 0 || isConverting || conversions.length > 0;

  // Keyboard shortcut listener (Spacebar triggers passage)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isConverting && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (stagedFiles.length > 0) {
          startConversionSequence();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startConversionSequence, isConverting, stagedFiles]);

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
            handleAppendFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />

      {/* VIEW 1: CLEAN MINIMALIST LANDING PORTAL (When No Files are Staged/Converting) */}
      {!isWorkspaceActive ? (
        <LandingPortal
          onFileSelect={handleAppendFiles}
          onSelectSample={handleSelectSample}
          isDraggingOver={isDraggingOver}
          workerOnline={workerStatus.online}
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
                  onClick={() => {
                    setStagedFiles([]);
                    setConversions([]);
                  }}
                  className="avero-light-glossy hover:scale-105 active:scale-95 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-[#161618] transition-all border border-black/5 shadow-2xs whitespace-nowrap shrink-0"
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
                  onClick={() => {
                    setActiveMode('documents');
                    setSelectedTargetFormat('pages');
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap ${
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
                  onClick={() => {
                    setActiveMode('spreadsheets');
                    setSelectedTargetFormat('numbers');
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap ${
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
                  onClick={() => {
                    setActiveMode('presentations');
                    setSelectedTargetFormat('key');
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap ${
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
                  onClick={() => {
                    setActiveMode('utilities');
                    setSelectedTargetFormat('pdf');
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-black whitespace-nowrap ${
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
                  className="avero-dark-glossy text-white px-3.5 sm:px-4.5 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 border border-white/20 hover:scale-105 transition-all whitespace-nowrap shrink-0 sheen-container"
                >
                  <Plus className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
                  <span className="text-white whitespace-nowrap">Add Files</span>
                </button>
              </div>
            </div>
          </header>

          {/* Multi-File Staging Queue Banner */}
          {stagedFiles.length > 1 && !isConverting && (
            <div className="max-w-5xl mx-auto w-full px-4 pt-4">
              <div className="avero-clay-card rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                    <Files className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#161618] block">
                      {stagedFiles.length} Documents Staged for Passage
                    </span>
                    <span className="text-[11px] text-[#71717A] font-medium">
                      {stagedFiles.map((f) => f.name).slice(0, 3).join(', ')}
                      {stagedFiles.length > 3 ? ` +${stagedFiles.length - 3} more` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setStagedFiles([])}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#71717A] hover:text-rose-600 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => startConversionSequence()}
                    className="avero-dark-glossy text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 border border-white/20 hover:scale-105 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Convert All {stagedFiles.length} Files</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HERO SECTION: THE SEAM (Split Layout) */}
          <main className="flex-1 flex flex-col justify-center w-full px-4 py-6">
            <div className="max-w-5xl mx-auto w-full relative min-h-[500px] flex flex-col md:flex-row items-stretch gap-6">
              {/* LEFT: PAPER TERRITORY */}
              <div className="flex-1 flex flex-col">
                <TerritoryPanel
                  config={paperConfig}
                  activeFile={sourceTerritory === 'paper' ? activeFile : null}
                  stagedFiles={stagedFiles}
                  onFileSelect={handleAppendFiles}
                  onRemoveStagedFile={handleRemoveStagedFile}
                  isSource={sourceTerritory === 'paper'}
                  selectedTargetFormat={selectedTargetFormat}
                  onChangeTargetFormat={setSelectedTargetFormat}
                  onSelectSample={handleSelectSample}
                  onTriggerConvert={(target) => startConversionSequence(target)}
                  activeMode={activeMode}
                />
              </div>

              {/* CENTER: THE GATE */}
              <div className="relative z-30 flex items-center justify-center shrink-0 self-center">
                <TheGate
                  isDraggingOver={isDraggingOver}
                  isConverting={isConverting}
                  animatingFile={animatingFile}
                  onGateClick={() => {
                    if (stagedFiles.length > 0) {
                      startConversionSequence();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                />
              </div>

              {/* RIGHT: GLASS TERRITORY */}
              <div className="flex-1 flex flex-col">
                <TerritoryPanel
                  config={glassConfig}
                  activeFile={sourceTerritory === 'glass' ? activeFile : null}
                  stagedFiles={stagedFiles}
                  onFileSelect={handleAppendFiles}
                  onRemoveStagedFile={handleRemoveStagedFile}
                  isSource={sourceTerritory === 'glass'}
                  selectedTargetFormat={selectedTargetFormat}
                  onChangeTargetFormat={setSelectedTargetFormat}
                  onSelectSample={handleSelectSample}
                  onTriggerConvert={(target) => startConversionSequence(target)}
                  activeMode={activeMode}
                />
              </div>
            </div>
          </main>

          {/* BELOW THE FOLD: STATUS STRIP & RESULTS */}
          <StatusStrip
            conversions={conversions}
            activeConversion={activeConversion}
            onClearConversions={() => setConversions([])}
            onDeleteConversion={handleDeleteConversion}
            localIp={workerStatus.localIp}
            errorMessage={errorMessage}
            onDismissError={() => setErrorMessage(null)}
          />

          {/* STICKY BOTTOM THUMB ACTION BAR FOR MOBILE */}
          <MobileActionBar
            stagedFiles={stagedFiles}
            isConverting={isConverting}
            activeConversion={activeConversion}
            onConvertAll={() => startConversionSequence()}
            onOpenFileInput={() => fileInputRef.current?.click()}
            activeMode={activeMode}
            onChangeMode={(mode) => {
              setActiveMode(mode);
              if (mode === 'documents') setSelectedTargetFormat('pages');
              else if (mode === 'spreadsheets') setSelectedTargetFormat('numbers');
              else if (mode === 'presentations') setSelectedTargetFormat('key');
            }}
            conversions={conversions}
          />
        </div>
      )}
    </div>
  );
}
