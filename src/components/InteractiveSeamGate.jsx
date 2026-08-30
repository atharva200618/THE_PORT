import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Sparkles, Zap, ArrowRight, ArrowLeft, Layers, FileText } from 'lucide-react';
import TactilePaperSheet from './TactilePaperSheet';
import TranslucentGlassSheet from './TranslucentGlassSheet';
import { sounds } from '../utils/audio';

export default function InteractiveSeamGate({
  file,
  isConverting,
  progress,
  onConvert,
  onFileDrop,
  animatingFile
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const containerRef = useRef(null);

  const docTitle = file ? file.name.replace(/\.[^/.]+$/, "") : "Quarterly Strategic Report";
  const docExt = file ? file.name.split('.').pop().toLowerCase() : "docx";

  // Handle Seam Slider Drag
  const handleMouseMove = (e) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingSlider || !containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  useEffect(() => {
    const handleUp = () => setIsDraggingSlider(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      
      {/* Interactive Split Canvas Preview Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[420px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none bg-[#111318]"
      >
        
        {/* Right Glass Layer (Base) */}
        <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center bg-[#15161C] glass-territory-bg">
          <div className="w-full max-w-xl h-full">
            <TranslucentGlassSheet title={docTitle} docType="pages" />
          </div>
        </div>

        {/* Left Paper Layer (Clipped by Slider Position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden paper-territory-bg flex items-center justify-center border-r border-[#E8A23D]"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="p-4 md:p-8 h-full flex items-center justify-center"
            style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
          >
            <div className="w-full max-w-xl h-full">
              <TactilePaperSheet title={docTitle} docType={docExt} />
            </div>
          </div>
        </div>

        {/* Central Draggable Seam Divider Line & Port Gate */}
        <div
          className="absolute inset-y-0 flex items-center justify-center pointer-events-none z-30"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          {/* Vertical Energy Line */}
          <div className="w-[3px] h-full bg-gradient-to-b from-[#E9E4D8] via-[#E8A23D] to-[#3D8BFD] shadow-[0_0_15px_#E8A23D]" />

          {/* Draggable Gate Capsule */}
          <div
            onMouseDown={() => { setIsDraggingSlider(true); sounds.playSnap(); }}
            onTouchStart={() => { setIsDraggingSlider(true); sounds.playSnap(); }}
            className="absolute pointer-events-auto cursor-ew-resize group flex flex-col items-center justify-center"
          >
            {/* The Gate Capsule */}
            <motion.div
              animate={{
                scale: isConverting ? 1.15 : 1,
                boxShadow: isConverting
                  ? '0 0 35px #E8A23D, inset 0 0 15px #E8A23D'
                  : '0 0 20px rgba(0,0,0,0.6)'
              }}
              className="w-14 h-24 md:w-16 md:h-28 rounded-full bg-[#15161C] border-2 border-[#E8A23D] backdrop-blur-xl flex flex-col items-center justify-between py-2 px-1 text-white shadow-2xl transition-transform active:scale-95 hover:border-white"
            >
              {/* Connector Pins */}
              <div className="w-5 h-[2px] bg-[#E9E4D8] rounded-full" />

              <div className="flex flex-col items-center gap-0.5">
                {isConverting ? (
                  <Sparkles className="w-5 h-5 text-[#E8A23D] animate-spin" />
                ) : (
                  <ArrowLeftRight className="w-5 h-5 text-[#E8A23D] group-hover:rotate-180 transition-transform duration-300" />
                )}
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#E8A23D]">
                  PORT
                </span>
              </div>

              <div className="w-5 h-[2px] bg-[#3D8BFD] rounded-full" />
            </motion.div>

            {/* Slider Hint Tag */}
            <span className="absolute -bottom-8 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              Drag to scrub border
            </span>
          </div>
        </div>

        {/* Territory Badges on corners */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded bg-[#24211C] text-[#E9E4D8] text-[10px] font-mono font-bold shadow-md border border-[#B8AE98]/40">
            &larr; PAPER TERRITORY (.DOCX / .PDF)
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-[#3D8BFD]/20 text-[#3D8BFD] text-[10px] font-mono font-bold backdrop-blur-md border border-[#3D8BFD]/40 shadow-glass-glow">
            GLASS TERRITORY (.PAGES) &rarr;
          </span>
        </div>

      </div>

      {/* Interactive Helper Text */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8A23D] animate-ping" />
          <span>Interactive Seam Gate &bull; Drag center handle to scrub transformation</span>
        </div>
        <span className="hidden sm:inline text-slate-500">
          Split Position: {Math.round(sliderPos)}%
        </span>
      </div>

    </div>
  );
}
