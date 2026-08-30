import React from 'react';
import { Layers, Sparkles, Command, ShieldCheck, Cpu } from 'lucide-react';

export default function TranslucentGlassSheet({ title = "Quarterly Strategic Report", docType = "pages" }) {
  return (
    <div className="w-full h-full bg-[#1A2234]/85 text-slate-100 p-6 md:p-8 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-2xl relative flex flex-col justify-between overflow-hidden select-none font-glass">
      
      {/* Dynamic Specular Glass Glint */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#3D8BFD]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-[#E8A23D]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-b border-white/10 pb-2 relative z-10">
        <div className="flex items-center gap-1.5 text-[#3D8BFD]">
          <Layers className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wider">iWORK VECTOR ENGINE</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#3D8BFD]/20 text-[#3D8BFD] border border-[#3D8BFD]/30 font-bold uppercase">
          .PAGES CANVAS
        </span>
      </div>

      {/* Main Document Content */}
      <div className="space-y-4 pt-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-[#3D8BFD]/20 text-[#3D8BFD] border border-[#3D8BFD]/30 font-bold">
            GLASS TERRITORY
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            APPLE PAGES 14.2
          </span>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h2>
          <p className="text-[11px] font-mono text-[#3D8BFD] mt-0.5">
            FLUID VECTOR CANVAS &bull; PLUS JAKARTA GEOMETRIC SANS
          </p>
        </div>

        {/* Translucent Card Cards */}
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed pt-2">
          <p className="font-sans">
            Converted into an Apple Pages canvas package with preserved typography weights, fluid vector curves, and native macOS backdrop filters.
          </p>
          
          {/* Glass Spec Pill Container */}
          <div className="grid grid-cols-3 gap-2 border border-white/10 p-2.5 bg-white/5 rounded-xl text-[10px] font-mono backdrop-blur-md">
            <div>
              <span className="text-slate-400 block text-[9px]">CANVAS</span>
              <strong className="text-white">VECTOR 2D</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">BLUR DEPTH</span>
              <strong className="text-[#3D8BFD]">24 PX</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">SHADOWS</span>
              <strong className="text-[#E8A23D]">COMPOSITED</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PORT PASSPORT VALIDATED &bull; READY TO OPEN</span>
        </div>

        <div className="p-1 rounded-md bg-white/10 text-slate-300">
          <Command className="w-3 h-3" />
        </div>
      </div>

    </div>
  );
}
