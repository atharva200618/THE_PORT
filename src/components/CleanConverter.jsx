import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, ArrowLeftRight, CheckCircle2, Download, FileText, Layers, RefreshCw, Sparkles, File, Trash2 } from 'lucide-react';
import { getFileTerritory, getTargetFormat, processFileConversion, formatFileSize } from '../utils/fileConverter';

export default function CleanConverter() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [conversionState, setConversionState] = useState('idle'); // 'idle' | 'converting' | 'completed'
  const [progress, setProgress] = useState(null);
  const [convertedResult, setConvertedResult] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Handle Sample Buttons
  const handleSampleClick = (format) => {
    let name = 'Quarterly_Report_2026.docx';
    let type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (format === 'pdf') {
      name = 'Design_Guidelines.pdf';
      type = 'application/pdf';
    } else if (format === 'pages') {
      name = 'Project_Keynote.pages';
      type = 'application/x-iwork-pages-sffpages';
    }

    const dummyContent = `The Port Sample Content - Format: ${format.toUpperCase()}`;
    const blob = new Blob([dummyContent], { type });
    const sampleFile = new File([blob], name, { type });
    processSelectedFile(sampleFile);
  };

  // Run File Conversion
  const processSelectedFile = async (selectedFile) => {
    setFile(selectedFile);
    setConversionState('converting');
    setConvertedResult(null);

    const targetFormat = getTargetFormat(selectedFile.name);

    try {
      const result = await processFileConversion(selectedFile, targetFormat, (stepInfo) => {
        setProgress(stepInfo);
      });

      setConvertedResult(result);
      setConversionState('completed');
      setHistory((prev) => [result, ...prev]);
    } catch (err) {
      console.error(err);
      setConversionState('idle');
    }
  };

  const handleReset = () => {
    setFile(null);
    setConversionState('idle');
    setProgress(null);
    setConvertedResult(null);
  };

  const sourceTerritory = file ? getFileTerritory(file.name) : 'paper';
  const targetFormat = file ? getTargetFormat(file.name) : 'pages';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Territory Indicator Switch Bar */}
      <div className="clean-glass-card rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Paper Side */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#E9E4D8] text-[#15161C] flex items-center justify-center font-bold font-paper text-lg shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-paper text-base font-bold text-white">Paper Territory</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E9E4D8]/20 text-[#E9E4D8] border border-[#E9E4D8]/30 font-semibold">
                DOCX &bull; PDF
              </span>
            </div>
            <p className="text-xs text-slate-400">Standard Office & Print documents</p>
          </div>
        </div>

        {/* Central Port Seam Switcher Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8A23D]/10 border border-[#E8A23D]/30 text-[#E8A23D] text-xs font-mono font-semibold">
          <ArrowLeftRight className="w-4 h-4" />
          <span>Bi-Directional Port Gate</span>
        </div>

        {/* Glass Side */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <div className="w-10 h-10 rounded-xl bg-[#3D8BFD] text-white flex items-center justify-center font-bold font-glass text-lg shadow-glass-glow">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-glass text-base font-bold text-white">Glass Territory</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D8BFD]/20 text-[#3D8BFD] border border-[#3D8BFD]/30 font-semibold">
                PAGES
              </span>
            </div>
            <p className="text-xs text-slate-400">Apple iWork layout documents</p>
          </div>
        </div>
      </div>

      {/* Main Drag and Drop Hero Card */}
      <div className="clean-glass-card rounded-3xl p-6 md:p-10 space-y-6">
        
        {conversionState === 'idle' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`clean-dropzone rounded-2xl p-8 md:p-14 text-center cursor-pointer space-y-5 flex flex-col items-center justify-center ${
              isDragging ? 'clean-dropzone-active scale-[1.01]' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.doc,.pdf,.pages"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-16 h-16 rounded-2xl bg-[#E8A23D]/10 border border-[#E8A23D]/30 text-[#E8A23D] flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Drag & Drop file to convert
              </h3>
              <p className="text-sm text-slate-300">
                Drop your <strong className="text-[#E9E4D8]">.docx</strong>, <strong className="text-[#E9E4D8]">.pdf</strong>, or <strong className="text-[#3D8BFD]">.pages</strong> file anywhere here
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/90 font-semibold text-sm transition-all shadow-lg active:scale-95"
              >
                Browse File
              </button>

              <span className="text-xs text-slate-500 font-mono">OR TRY SAMPLE:</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSampleClick('docx'); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10"
                >
                  .docx
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSampleClick('pdf'); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10"
                >
                  .pdf
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSampleClick('pages'); }}
                  className="px-3 py-1.5 rounded-lg bg-[#3D8BFD]/15 hover:bg-[#3D8BFD]/25 text-xs font-mono text-[#3D8BFD] border border-[#3D8BFD]/30"
                >
                  .pages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Conversion & Result Card */}
        {conversionState !== 'idle' && file && (
          <div className="space-y-6">
            
            {/* Selected File Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#E8A23D]/10 text-[#E8A23D] border border-[#E8A23D]/20">
                  {sourceTerritory === 'paper' ? <FileText className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                </div>

                <div>
                  <h4 className="font-mono text-base font-bold text-white truncate max-w-xs">
                    {file.name}
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    Size: {formatFileSize(file.size)} &bull; Source: <span className="uppercase text-[#E8A23D]">{sourceTerritory}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 text-slate-200 border border-white/15">
                  Converting to <strong className="text-[#3D8BFD] uppercase">{targetFormat}</strong>
                </span>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Choose another file"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Converting Progress State */}
            {conversionState === 'converting' && (
              <div className="p-6 rounded-2xl bg-[#E8A23D]/5 border border-[#E8A23D]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-mono text-[#E8A23D]">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{progress ? progress.statusText : 'Crossing over the Port Gate...'}</span>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#E8A23D]">
                    {progress ? progress.progressPercent : 0}%
                  </span>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#E8A23D] h-full"
                    animate={{ width: `${progress ? progress.progressPercent : 0}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Completed Download State */}
            {conversionState === 'completed' && convertedResult && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Conversion Successful!
                    </h4>
                    <p className="text-xs text-slate-300">
                      Your document has crossed over and is ready for download.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={convertedResult.downloadUrl}
                    download={convertedResult.outputName}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/90 font-bold text-sm transition-all shadow-glass-glow active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download {convertedResult.outputName}</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors border border-white/10"
                  >
                    Convert Another File
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* History Log Table */}
      {history.length > 0 && (
        <div className="clean-glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Recent Converted Files ({history.length})
            </h4>

            <button
              onClick={() => setHistory([])}
              className="text-xs font-mono text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-white font-semibold truncate">
                    {item.originalName}
                  </span>
                  <span className="font-mono text-slate-500">
                    ({item.originalSize})
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#3D8BFD]/20 text-[#3D8BFD] uppercase font-bold">
                    {item.targetType}
                  </span>

                  <a
                    href={item.downloadUrl}
                    download={item.outputName}
                    className="p-1.5 rounded-lg bg-[#3D8BFD] text-white hover:bg-[#3D8BFD]/80 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
