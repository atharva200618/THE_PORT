import React from 'react';
import { FileText, Stamp, Hash, Layers } from 'lucide-react';

export default function TactilePaperSheet({ title = "Quarterly Strategic Report", docType = "docx" }) {
  return (
    <div className="w-full h-full bg-[#F6F2E8] text-[#24211C] p-6 md:p-8 rounded-lg shadow-2xl border border-[#C5BBA6] relative flex flex-col justify-between overflow-hidden select-none font-paper">
      
      {/* Top Printed Grid Ruler Guides */}
      <div className="absolute top-2 left-3 right-3 flex justify-between text-[8px] font-mono text-[#8C826F] uppercase border-b border-[#D8CEBA] pb-1">
        <span>ISO-216 / A4 PRINT SPEC</span>
        <span>GRID 8x8pt &bull; 120 GSM</span>
        <span>{docType.toUpperCase()} FORMAT</span>
      </div>

      {/* Folded Paper Corner Effect */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#D8CEBA] via-[#E4DCCB] to-[#F6F2E8] border-b border-l border-[#C5BBA6] shadow-sm" />

      {/* Main Document Content */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#24211C] text-[#F6F2E8] font-bold">
            PAPER TERRITORY
          </span>
          <span className="text-[10px] font-mono text-[#7A705E]">
            DOC_REF #4902-DX
          </span>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1A1814] leading-tight">
            {title}
          </h2>
          <p className="text-[11px] font-mono text-[#7A705E] mt-0.5">
            PRINT LAYOUT ENGINE &bull; FRAUNCES INK-TRAP SERIF
          </p>
        </div>

        {/* Realistic Grid Text Lines */}
        <div className="space-y-2 text-xs text-[#3E3A33] leading-relaxed border-t border-[#D8CEBA] pt-3">
          <p className="indent-4 font-serif">
            This document represents a physical print-descended manuscript. Typography is anchored strictly to linear lead baselines with calibrated ink traps for high-density rendering.
          </p>
          
          {/* Simulated Printed Table */}
          <div className="grid grid-cols-3 gap-2 border border-[#C5BBA6] p-2 bg-[#EFE9DC]/60 text-[10px] font-mono mt-2 rounded-sm">
            <div className="border-r border-[#C5BBA6] pr-1">
              <span className="text-[#7A705E] block">STRUCTURE</span>
              <strong className="text-[#1A1814]">XML AST</strong>
            </div>
            <div className="border-r border-[#C5BBA6] pr-1">
              <span className="text-[#7A705E] block">DENSITY</span>
              <strong className="text-[#1A1814]">300 DPI</strong>
            </div>
            <div>
              <span className="text-[#7A705E] block">FLOW</span>
              <strong className="text-[#1A1814]">PAGINATED</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer & Rubber Stamp */}
      <div className="pt-4 border-t border-[#D8CEBA] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#7A705E]">
          <Hash className="w-3 h-3 text-[#E8A23D]" />
          <span>PAGE 01 OF 04 &bull; SEC_HASH: 0x9B1C</span>
        </div>

        {/* Red / Brown Stamp */}
        <div className="border border-[#A8432A]/70 text-[#A8432A] px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest rotate-[-4deg] opacity-85">
          PORT VERIFIED
        </div>
      </div>

    </div>
  );
}
