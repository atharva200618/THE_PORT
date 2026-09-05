import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Lock,
  FileText,
  CheckCircle2,
  HardDrive,
  Command,
  CornerDownLeft,
  Trash2,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { MODES, getTargetActionDetails } from '../../config/featuresConfig';
import {
  ApplePagesIcon,
  MicrosoftWordIcon,
  AppleNumbersIcon,
  MicrosoftExcelIcon,
  AppleKeynoteIcon,
  MicrosoftPowerPointIcon,
  AdobePdfIcon
} from '../BrandIcons';

export default function WorkspaceCompanion({
  files = [],
  activeMode = 'documents',
  onSelectTarget,
  onRemoveFile,
  onStartConvert,
  onClearAll
}) {
  const currentMode = MODES[activeMode] || MODES.documents;
  const primaryFile = files[0];
  const idleFiles = files.filter((f) => f.status === 'idle');
  const convertingFiles = files.filter((f) => f.status === 'converting');
  const completedFiles = files.filter((f) => f.status === 'done');

  const actionDetails = primaryFile
    ? getTargetActionDetails(primaryFile.sourceFormat, primaryFile.targetFormat)
    : null;

  return (
    <div className="space-y-4 w-full">
      {/* 1. Live M1 Engine Telemetry & Privacy Shield */}
      <div className="avero-clay-card rounded-3xl p-5 bg-white/90 border border-white/95 shadow-clay-card space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#161618] text-white flex items-center justify-center shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#161618] tracking-tight">
                M1 Neural & Core Pipeline
              </h4>
              <span className="text-[10px] text-[#71717A] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hardware Accelerated • Sub-second
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-black text-emerald-700 tracking-wider uppercase shadow-2xs">
            Direct Silicon
          </span>
        </div>

        {/* Engine Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#F6F6F8] border border-black/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#71717A] uppercase tracking-wider">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Conversion Core</span>
            </div>
            <p className="text-xs font-bold text-[#161618] truncate">
              {primaryFile?.sourceFormat === 'pdf' ? 'PyMuPDF + pikepdf' : 'LibreOffice 24.8 Core'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F6F6F8] border border-black/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#71717A] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span>Privacy Sandbox</span>
            </div>
            <p className="text-xs font-bold text-[#161618] truncate">
              100% Local In-Memory
            </p>
          </div>
        </div>

        {/* Security & Fidelity Bullet Points */}
        <div className="space-y-2 pt-1">
          <div className="flex items-start gap-2 text-[11px] text-[#4A4A52] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="font-bold text-[#161618]">Zero Cloud Upload:</strong> Documents never leave your device storage.
            </span>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-[#4A4A52] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong className="font-bold text-[#161618]">Vector Typography:</strong> Exact layout, fonts, and geometry preservation.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Passage Telemetry & Specs */}
      {primaryFile && (
        <div className="avero-clay-card rounded-3xl p-5 bg-white/90 border border-white/95 shadow-clay-card space-y-3.5">
          <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
            <span className="text-[10px] font-black uppercase text-[#71717A] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Passage Target Specs</span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {currentMode.name}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-zinc-50 to-zinc-100 border border-black/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#161618] text-white flex items-center justify-center text-[10px] font-black uppercase">
                {primaryFile.sourceFormat}
              </div>
              <div>
                <span className="text-xs font-black text-[#161618] block truncate max-w-[120px]">
                  {primaryFile.name}
                </span>
                <span className="text-[10px] text-[#71717A] font-medium">
                  {primaryFile.originalSize || 'Input file'}
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-[#71717A] shrink-0" />

            <div className="text-right">
              <span className="text-xs font-black text-blue-700 block uppercase">
                {primaryFile.targetFormat || 'Target'}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {actionDetails?.badge || 'Lossless'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Document Queue Matrix (When multiple files are present) */}
      {files.length > 1 && (
        <div className="avero-clay-card rounded-3xl p-5 bg-white/90 border border-white/95 shadow-clay-card space-y-3">
          <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
            <span className="text-[10px] font-black uppercase text-[#71717A] tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-600" />
              <span>Workspace Queue ({files.length})</span>
            </span>
            {onClearAll && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onClearAll();
                }}
                className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {files.map((f, idx) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F6F6F8] border border-black/5 hover:border-black/10 transition-all text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-black text-zinc-400">#{idx + 1}</span>
                  <span className="font-bold text-[#161618] truncate max-w-[130px]">{f.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-white text-zinc-700 border border-black/5 uppercase">
                    → {f.targetFormat}
                  </span>
                  {onRemoveFile && f.status === 'idle' && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(f.id)}
                      className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-black/5 cursor-pointer transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Pro Shortcuts & Hints */}
      <div className="avero-clay-card rounded-3xl p-4 bg-white/70 border border-white/90 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] text-[#71717A] font-semibold">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-[#161618]" />
            <span>Convert Action:</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-black/5 text-[10px] font-black text-[#161618] shadow-2xs">
            <CornerDownLeft className="w-2.5 h-2.5" />
            <span>Return / Enter</span>
          </span>
        </div>
      </div>
    </div>
  );
}
