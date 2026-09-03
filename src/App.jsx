import React, { useState, useEffect, useCallback, useRef } from 'react';
import LandingPortal from './components/LandingPortal';
import PaperTerritory from './components/PaperTerritory';
import GlassTerritory from './components/GlassTerritory';
import TheGate from './components/TheGate';
import StatusStrip from './components/StatusStrip';
import MobileActionBar from './components/MobileActionBar';
import { 
  submitConversionJob, 
  fetchJobStatus, 
  getDownloadUrl, 
  simulateClientConversion, 
  checkBackendHealth,
  fetchWorkerStatus,
  deleteJobFromServer,
  formatBytes 
} from './utils/api';
import { sounds } from './utils/audio';
import { triggerHaptic } from './utils/haptics';
import { 
  ArrowLeftRight, 
  ArrowLeft,
  Upload, 
  Volume2, 
  VolumeX, 
  Layers, 
  Zap, 
  X, 
  Files, 
  Plus, 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  ShieldCheck 
} from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState('documents'); // 'documents' | 'spreadsheets' | 'presentations'
  const [stagedFiles, setStagedFiles] = useState([]); // Clean initial state for Landing Portal
  const [selectedTargetFormat, setSelectedTargetFormat] = useState('pages');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [activeConversion, setActiveConversion] = useState(null);
  const [animatingFile, setAnimatingFile] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [workerStatus, setWorkerStatus] = useState({ online: false });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [strictPrivacy, setStrictPrivacy] = useState(false);

  const fileInputRef = useRef(null);

  // Determine if Workspace view or Landing Portal is active
  const isWorkspaceActive = stagedFiles.length > 0 || isConverting || conversions.length > 0;

  // Poll worker heartbeat & health
  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchWorkerStatus();
      setWorkerStatus(status);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 6000);
    return () => clearInterval(interval);
  }, []);

  // Mode Auto-detection helper
  const detectModeFromFile = (ext = '') => {
    const cleaned = ext.toLowerCase().replace(/^\./, '');
    if (['key', 'pptx', 'ppt'].includes(cleaned)) return 'presentations';
    if (['numbers', 'xlsx', 'xls', 'csv'].includes(cleaned)) return 'spreadsheets';
    return 'documents';
  };

  // Determine territory from filename (Apple iWork -> Glass, Universal/PC -> Paper)
  const getFileTerritory = (filename = '') => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pages', 'key', 'numbers'].includes(ext)) return 'glass';
    return 'paper';
  };

  // Determine sensible default target format based on source extension
  const getDefaultTargetFormat = (filename = '') => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pages') return 'docx';
    if (ext === 'docx' || ext === 'doc' || ext === 'pdf') return 'pages';
    if (ext === 'key') return 'pptx';
    if (ext === 'pptx' || ext === 'ppt') return 'key';
    if (ext === 'numbers') return 'xlsx';
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'numbers';
    return 'pages';
  };

  // Primary active file is the latest or first staged file
  const activeFile = stagedFiles.length > 0 ? stagedFiles[0] : null;
  const sourceTerritory = activeFile ? getFileTerritory(activeFile.name) : 'paper';

  // Add / Append new files to the staging queue (avoiding exact duplicates)
  const handleAppendFiles = useCallback((incoming) => {
    setErrorMessage(null);
    const incomingList = Array.isArray(incoming) ? incoming : [incoming];
    if (incomingList.length === 0) return;

    // Auto-detect & switch active mode based on dropped file
    const firstExt = (incomingList[0].name.split('.').pop() || '').toLowerCase();
    const detected = detectModeFromFile(firstExt);
    setActiveMode(detected);

    setStagedFiles((prev) => {
      const baseList = [...prev];
      for (const newF of incomingList) {
        if (!baseList.some(item => item.name === newF.name && item.size === newF.size)) {
          baseList.push(newF);
        }
      }
      return baseList;
    });

    // Update target format default
    setSelectedTargetFormat(getDefaultTargetFormat(incomingList[0].name));
  }, []);

  // Remove a specific file or category from staging
  const handleRemoveStagedFile = useCallback((fileName) => {
    if (fileName === 'ALL_PAPER') {
      setStagedFiles(prev => prev.filter(f => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        return ['pages', 'key', 'numbers'].includes(ext);
      }));
    } else if (fileName === 'ALL_GLASS') {
      setStagedFiles(prev => prev.filter(f => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        return !['pages', 'key', 'numbers'].includes(ext);
      }));
    } else {
      setStagedFiles((prev) => prev.filter(f => f.name !== fileName));
    }
  }, []);

  // Global Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.clientX <= 0 || e.clientY <= 0) {
      setIsDraggingOver(false);
    }
  };

  // Process a single file conversion
  const convertSingleFile = async (inputFile, targetFormat, index = 0, total = 1) => {
    const sourceExt = (inputFile.name.split('.').pop() || '').toLowerCase();
    const resolvedTarget = targetFormat || getDefaultTargetFormat(inputFile.name);

    if (sourceExt === resolvedTarget) {
      throw new Error(`Source document '${inputFile.name}' is already .${sourceExt}.`);
    }

    const prefix = total > 1 ? `[${index + 1}/${total}] ` : '';
    const isAppleSource = ['pages', 'key', 'numbers'].includes(sourceExt);

    // 1. Trigger 600ms The Gate Morph Animation
    setAnimatingFile({
      name: inputFile.name,
      sourceType: sourceExt,
      targetType: resolvedTarget,
      direction: isAppleSource ? 'glass-to-paper' : 'paper-to-glass'
    });

    if (soundEnabled) sounds.playGateTransit();

    setActiveConversion({
      statusText: `${prefix}Crossing over ${inputFile.name}…`,
      progressPercent: 25
    });

    setTimeout(() => {
      setAnimatingFile(null);
    }, 650);

    // 2. Attempt real Backend API Job
    let result = null;
    try {
      const job = await submitConversionJob(inputFile, resolvedTarget);
      setActiveConversion({
        statusText: `${prefix}Engaging Port Gate on Mac Worker…`,
        progressPercent: 40
      });

      const pollInterval = 1500;
      const maxAttempts = 80; // 120 seconds total
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, pollInterval));
        attempts++;

        const jobStatus = await fetchJobStatus(job.jobId);
        if (jobStatus.status === 'processing' || jobStatus.status === 'pending') {
          setActiveConversion({
            statusText: ['pages', 'key', 'numbers'].includes(resolvedTarget)
              ? `${prefix}Synthesizing Apple iWork vector canvas…` 
              : resolvedTarget === 'docx' || resolvedTarget === 'xlsx' || resolvedTarget === 'pptx'
              ? `${prefix}Mapping OpenXML baseline grid…`
              : `${prefix}Rendering PDF vector layout…`,
            progressPercent: Math.min(92, 40 + attempts * 4)
          });
        } else if (jobStatus.status === 'done') {
          result = {
            id: jobStatus.id,
            originalName: jobStatus.originalName,
            originalSize: formatBytes(jobStatus.fileSize),
            sourceFormat: jobStatus.sourceFormat,
            targetFormat: jobStatus.targetFormat,
            downloadUrl: getDownloadUrl(jobStatus.id),
            outputName: `${jobStatus.originalName.replace(/\.[^/.]+$/, '')}.${jobStatus.targetFormat}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'done'
          };
          break;
        } else if (jobStatus.status === 'failed') {
          throw new Error(jobStatus.error || `Conversion failed for ${inputFile.name}.`);
        }
      }

      if (!result && attempts >= maxAttempts) {
        throw new Error(`Conversion timed out for ${inputFile.name}.`);
      }
    } catch (backendErr) {
      console.warn('Backend conversion error:', backendErr.message);
      const isSample = inputFile.name.includes('Sample') || inputFile.name.includes('Executive') || inputFile.name.includes('Architectural') || inputFile.name.includes('Product');
      if (isSample) {
        result = await simulateClientConversion(inputFile, resolvedTarget, (step) => {
          setActiveConversion({
            statusText: `${prefix}${step.statusText}`,
            progressPercent: step.progressPercent
          });
        });
      } else {
        throw backendErr;
      }
    }

    if (soundEnabled) sounds.playSnap();
    return result;
  };

  // Batch Queue & Single Conversion Orchestration
  const startConversionSequence = useCallback(async (explicitTarget = null) => {
    const filesToProcess = stagedFiles.length > 0 ? stagedFiles : [];
    if (filesToProcess.length === 0 || isConverting) return;

    setIsConverting(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < filesToProcess.length; i++) {
        const curFile = filesToProcess[i];
        const target = explicitTarget || (filesToProcess.length === 1 ? selectedTargetFormat : getDefaultTargetFormat(curFile.name));
        
        try {
          const res = await convertSingleFile(curFile, target, i, filesToProcess.length);
          if (res) {
            setConversions((prev) => [res, ...prev.filter(c => c.id !== res.id)]);
            triggerHaptic('success');
          }
        } catch (fileErr) {
          console.error(`Error converting ${curFile.name}:`, fileErr);
          setErrorMessage(fileErr.message);
          triggerHaptic('error');
          // Keep workspace active by adding a failed entry
          setConversions((prev) => [{
            id: `fail_${Date.now()}`,
            originalName: curFile.name,
            originalSize: '',
            sourceFormat: (curFile.name.split('.').pop() || '').toLowerCase(),
            targetFormat: target,
            status: 'failed',
            error: fileErr.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }, ...prev]);
        }
      }
      setStagedFiles([]);
    } finally {
      setIsConverting(false);
      setActiveConversion(null);
    }
  }, [stagedFiles, selectedTargetFormat, isConverting, soundEnabled]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleAppendFiles(droppedFiles);
    }
  };

  const handleDeleteConversion = async (id) => {
    await deleteJobFromServer(id);
    setConversions((prev) => prev.filter((item) => item.id !== id));
  };

  // Sample document selector across all modes
  const handleSelectSample = (format) => {
    let name = 'Executive_Strategic_Brief.docx';
    let size = 284000;
    if (format === 'pdf') {
      name = 'Architectural_Blueprint.pdf';
      size = 512000;
    } else if (format === 'pages') {
      name = 'Product_Marketing_Brief.pages';
      size = 720000;
    } else if (format === 'xlsx') {
      name = 'Annual_Financial_Model.xlsx';
      size = 450000;
    } else if (format === 'csv') {
      name = 'Global_Metrics_Export.csv';
      size = 180000;
    } else if (format === 'numbers') {
      name = 'Q4_Operating_Budget.numbers';
      size = 890000;
    } else if (format === 'pptx') {
      name = 'Series_A_Pitch_Deck.pptx';
      size = 1200000;
    } else if (format === 'key') {
      name = 'Apple_Keynote_Showcase.key';
      size = 1600000;
    }

    const sampleFile = new File(['The Port Sample Document Content'], name, { type: 'application/octet-stream' });
    Object.defineProperty(sampleFile, 'size', { value: size });
    handleAppendFiles([sampleFile]);
  };

  // Keyboard shortcut listener
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
                      {stagedFiles.map(f => f.name).slice(0, 3).join(', ')}{stagedFiles.length > 3 ? ` +${stagedFiles.length - 3} more` : ''}
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
                <PaperTerritory
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
                <GlassTerritory
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
