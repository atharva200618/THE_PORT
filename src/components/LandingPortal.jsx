import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Cpu, 
  Zap, 
  Smartphone, 
  ChevronRight, 
  Copy, 
  Check, 
  Sliders, 
  QrCode,
  FileText
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import {
  ApplePagesIcon,
  MicrosoftWordIcon,
  AppleNumbersIcon,
  MicrosoftExcelIcon,
  AppleKeynoteIcon,
  MicrosoftPowerPointIcon,
  AdobePdfIcon,
  ThePortLogo
} from './BrandIcons';

// 2026 Interactive Spotlight Passage Tool Card (1:1 AVERO Soft Clay & Glow)
function SpotlightPassageCard({ SourceIcon, TargetIcon, title, desc, tag, onClick }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleClick = (e) => {
    triggerHaptic('light');
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className="relative avero-clay-card p-6 sm:p-8 flex flex-col justify-between gap-5 cursor-pointer group overflow-hidden"
    >
      {/* 2026 Mouse-Follow Spotlight Radial Glow */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.95), transparent 80%)`
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Top: Dual Brand Passage Pair & Tag Badge */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Dual Brand Icon Passage Pair */}
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-black/5 shadow-sm group-hover:shadow-md group-hover:scale-[1.03] transition-all">
            <SourceIcon className="w-6 h-6 shrink-0" />
            <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#161618] group-hover:translate-x-0.5 transition-all" />
            <TargetIcon className="w-6 h-6 shrink-0" />
          </div>

          {/* Micro Fidelity Pill */}
          <span className="px-3 py-1 rounded-full bg-white/80 border border-black/5 text-[10px] font-extrabold tracking-wider uppercase text-[#71717A] group-hover:text-[#161618] group-hover:bg-white transition-colors shadow-2xs">
            {tag}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-[#161618] flex items-center justify-between">
            <span>{title}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#161618] group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPortal({
  onFileSelect,
  onSelectSample,
  isDraggingOver,
  workerOnline = false
}) {
  // Rotating floating headline texts inside the black capsule
  const rotatingHeadlines = [
    "Apple & Office Converter",
    "Pages ↔ Microsoft Word",
    "Keynote ↔ PowerPoint",
    "Numbers ↔ Microsoft Excel",
    "PDF ↔ Vector Canvas"
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % rotatingHeadlines.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = "THE PORT — Universal Apple iWork & Microsoft Office Passage Gate on Apple Silicon M1.";
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Base list of authentic brand icons
  const brandIconsList = [
    { name: 'Apple Pages', format: 'pages', Icon: ApplePagesIcon },
    { name: 'Microsoft Word', format: 'docx', Icon: MicrosoftWordIcon },
    { name: 'Apple Numbers', format: 'numbers', Icon: AppleNumbersIcon },
    { name: 'Microsoft Excel', format: 'xlsx', Icon: MicrosoftExcelIcon },
    { name: 'Apple Keynote', format: 'key', Icon: AppleKeynoteIcon },
    { name: 'Microsoft PowerPoint', format: 'pptx', Icon: MicrosoftPowerPointIcon },
    { name: 'Adobe PDF', format: 'pdf', Icon: AdobePdfIcon }
  ];

  // Tripled array for continuous seamless infinite river marquee
  const infiniteRiverList = [...brandIconsList, ...brandIconsList, ...brandIconsList];

  return (
    <div className="bg-[#EAEAEB] text-[#161618] selection:bg-[#1E1E22] selection:text-white font-sans">
      
      {/* =========================================================================
          SCREEN 1: FULL-VIEWPORT CLEAN HERO
          ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-between items-center relative overflow-hidden">
        
        {/* 1. Unique 2026 Futuristic Floating Navbar */}
        <header className="pt-6 sm:pt-8 px-4 w-full flex justify-center z-50">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(255,255,255,1)_inset] rounded-full px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4 sm:gap-8 w-full max-w-3xl transition-all duration-300">
            
            {/* Brand Logo Emblem */}
            <a href="#home" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#1E1E22] text-white flex items-center justify-center text-xs shadow-md border border-white/20">
                ⛩️
              </div>
              <ThePortLogo className="h-4 sm:h-4.5 w-auto" />
            </a>

            {/* Unique Segmented Nav Track with Active Pill Glow */}
            <nav className="bg-[#EBEBEF]/80 p-1 rounded-full flex items-center gap-1 text-xs font-semibold text-[#71717A] border border-black/5 shadow-inner">
              <a 
                href="#home" 
                className="px-4 py-1.5 rounded-full bg-[#1E1E22] text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all"
              >
                Home
              </a>
              <a 
                href="#tools" 
                className="px-4 py-1.5 rounded-full hover:text-[#161618] hover:bg-white/60 transition-all"
              >
                Tools
              </a>
              <a 
                href="#formats" 
                className="hidden sm:inline-block px-4 py-1.5 rounded-full hover:text-[#161618] hover:bg-white/60 transition-all"
              >
                Formats
              </a>
              <a 
                href="#how-it-works" 
                className="px-4 py-1.5 rounded-full hover:text-[#161618] hover:bg-white/60 transition-all"
              >
                FAQ
              </a>
            </nav>

            {/* Right M1 Engine Pulse Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-[11px] shrink-0 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${workerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="hidden sm:inline">M1 Engine</span>
              <span className="sm:hidden">M1</span>
            </div>

          </div>
        </header>

        {/* 2. Hero Centerpiece (Wider 2026 Layout & Slim Capsule Profile) */}
        <div className="w-full max-w-5xl px-6 text-center my-auto py-6 sm:py-10">
          
          {/* Title & Slim Floating Black Capsule */}
          <div className="space-y-3 mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#161618] leading-tight">
              Free Universal Document
            </h1>

            <motion.div 
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="inline-block pt-1"
            >
              {/* Glowing, sleek black capsule profile with ambient halo shadow */}
              <div className="bg-[#1E1E22] text-white px-7 sm:px-9 py-2 sm:py-2.5 rounded-full shadow-[0_14px_36px_rgba(0,0,0,0.35),_0_0_20px_rgba(0,0,0,0.15)] border border-white/20 hover:border-white/50 hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 inline-flex items-center justify-center min-w-[280px] sm:min-w-[380px] h-11 sm:h-12">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={headlineIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="text-xl sm:text-3xl md:text-[32px] font-extrabold tracking-tight text-white block text-center truncate leading-none"
                  >
                    {rotatingHeadlines[headlineIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* 3. Flowing River Carousel (Compact Snug Length & Small Icons) */}
          <div className="max-w-xs sm:max-w-sm mx-auto overflow-hidden relative my-5 sm:my-6 river-mask">
            <div className="animate-river items-center py-1">
              {infiniteRiverList.map((item, idx) => (
                <button
                  key={`${item.format}-${idx}`}
                  type="button"
                  onClick={() => onSelectSample(item.format)}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#1E1E22] border border-white/10 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.18)] hover:scale-110 hover:border-white/30 transition-transform cursor-pointer shrink-0 mx-1.5"
                  title={`${item.name} — Click to try sample`}
                >
                  <item.Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              ))}
            </div>
          </div>

          {/* 4. Grand Length Dropzone Bar (Extended to max-w-4xl) */}
          <div className="max-w-4xl mx-auto w-full space-y-6 mt-7 sm:mt-9">
            <label 
              className={`avero-inset-bar rounded-full px-7 sm:px-9 py-4 sm:py-4.5 flex items-center justify-between gap-4 cursor-pointer transition-all border border-white/40 ${
                isDraggingOver ? 'ring-2 ring-blue-500 scale-[1.01]' : 'hover:border-white/60'
              }`}
            >
              <input
                type="file"
                multiple
                accept=".docx,.doc,.pdf,.pages,.key,.pptx,.ppt,.numbers,.xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onFileSelect(Array.from(e.target.files));
                    e.target.value = '';
                  }
                }}
              />

              <div className="flex items-center gap-3 text-[#71717A] text-xs sm:text-base font-medium truncate">
                <span className="truncate">
                  {isDraggingOver ? 'Release document…' : 'Drop your document here (.pages, .docx, .key, .xlsx, .pdf)...'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="hidden sm:inline-block px-4 py-1.5 rounded-full avero-pill-badge text-xs font-bold text-[#161618]">
                  Browse
                </span>
                <span className="hidden sm:inline-block px-4 py-1.5 rounded-full avero-pill-badge text-xs font-bold text-[#161618]">
                  Batch
                </span>
                <div className="w-9 h-9 rounded-full avero-circle-glossy flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </label>

            {/* 2 Prominent 3D Action Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
              <label className="cursor-pointer avero-dark-glossy text-white px-8 sm:px-10 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all">
                <span>Select File</span>
                <input
                  type="file"
                  multiple
                  accept=".docx,.doc,.pdf,.pages,.key,.pptx,.ppt,.numbers,.xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onFileSelect(Array.from(e.target.files));
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => onSelectSample('pages')}
                className="avero-light-glossy text-[#161618] px-8 sm:px-10 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#161618]" />
                <span>Try Sample Passage</span>
              </button>
            </div>

            {/* 5. Unique Floating Glass Highlights Capsule */}
            <div className="pt-8 sm:pt-10 max-w-3xl mx-auto w-full">
              <div className="avero-bottom-bar rounded-full py-3.5 px-6 sm:px-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-[#161618] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/90">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#161618] stroke-[2.5]" />
                  <span>Fast Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#161618] stroke-[2.5]" />
                  <span>100% Free & Unlimited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#161618] stroke-[2.5]" />
                  <span>iOS, Android & Desktop</span>
                </div>
              </div>
            </div>

            {/* Elegant Clay Pill Badge */}
            <div className="pt-6 flex justify-center">
              <a 
                href="#tools" 
                className="avero-light-glossy rounded-full px-6 py-2.5 inline-flex items-center gap-2 text-xs font-bold text-[#161618] hover:scale-105 transition-all shadow-sm group border border-white/80"
              >
                <span>Explore Dedicated Passage Tools</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90 text-[#161618] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          SCREEN 2: BELOW-THE-FOLD SECTIONS
          ========================================================================= */}

      {/* 6. Explore Dedicated Passage Tools (2026 Interactive Spotlight Cards) */}
      <section id="tools" className="max-w-5xl mx-auto w-full px-4 py-16 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#161618] tracking-tight">
            Explore Dedicated Passage Tools
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-medium">
            Bi-directional vector conversions between Apple iWork and universal Microsoft Office standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Tool 1: Pages to Word */}
          <SpotlightPassageCard
            SourceIcon={ApplePagesIcon}
            TargetIcon={MicrosoftWordIcon}
            title="Pages to Word (.docx)"
            desc="Convert Apple Pages (.pages) documents into standard Microsoft Word (.docx) with exact typography, styles, and tables."
            tag="100% Vector"
            onClick={() => onSelectSample('pages')}
          />

          {/* Tool 2: Keynote to PowerPoint */}
          <SpotlightPassageCard
            SourceIcon={AppleKeynoteIcon}
            TargetIcon={MicrosoftPowerPointIcon}
            title="Keynote to PowerPoint (.pptx)"
            desc="Transform Apple Keynote (.key) presentations into PowerPoint (.pptx) decks with preserved slide animations and master templates."
            tag="Cinema 16:9"
            onClick={() => onSelectSample('key')}
          />

          {/* Tool 3: Numbers to Excel */}
          <SpotlightPassageCard
            SourceIcon={AppleNumbersIcon}
            TargetIcon={MicrosoftExcelIcon}
            title="Numbers to Excel (.xlsx)"
            desc="Export Apple Numbers (.numbers) spreadsheet canvases into Microsoft Excel workbooks with intact formulas and multi-table sheets."
            tag="Formula Grid"
            onClick={() => onSelectSample('numbers')}
          />

          {/* Tool 4: Word to Apple Pages */}
          <SpotlightPassageCard
            SourceIcon={MicrosoftWordIcon}
            TargetIcon={ApplePagesIcon}
            title="Word (.docx) to Apple Pages"
            desc="Seamlessly import Microsoft Word files directly into native Apple Pages packages for editing on macOS, iPad, and iPhone."
            tag="Native Package"
            onClick={() => onSelectSample('docx')}
          />

          {/* Tool 5: PowerPoint to Keynote */}
          <SpotlightPassageCard
            SourceIcon={MicrosoftPowerPointIcon}
            TargetIcon={AppleKeynoteIcon}
            title="PowerPoint (.pptx) to Keynote"
            desc="Pass PowerPoint presentations into Apple Keynote's cinematic vector stage with fluid hardware-accelerated transitions."
            tag="M1 Accelerated"
            onClick={() => onSelectSample('pptx')}
          />

          {/* Tool 6: PDF to Pages & DOCX */}
          <SpotlightPassageCard
            SourceIcon={AdobePdfIcon}
            TargetIcon={ApplePagesIcon}
            title="PDF to Pages & Word"
            desc="Reverse-engineer static PDF documents into fully editable Apple Pages vector packages and Microsoft Word DOCX formats."
            tag="Reverse Engine"
            onClick={() => onSelectSample('pdf')}
          />

        </div>
      </section>

      {/* 7. Format Support Matrix (1:1 AVERO Reference Style) */}
      <section id="formats" className="max-w-4xl mx-auto w-full px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block">
            <span className="avero-light-glossy px-4 sm:px-5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#E8A23D] border border-white inline-flex items-center shadow-xs">
              FORMAT SUPPORT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#161618] tracking-tight">
            Supported Output Formats & Fidelity
          </h2>
        </div>

        {/* 1:1 AVERO Soft Clay Format Container */}
        <div className="avero-clay-card p-2 sm:p-4 overflow-hidden border border-white/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-black/5 text-[#161618] font-extrabold">
                <tr>
                  <th className="py-4 px-5 sm:px-6">Document Type</th>
                  <th className="py-4 px-5 sm:px-6">Format</th>
                  <th className="py-4 px-5 sm:px-6">Available Passages</th>
                  <th className="py-4 px-5 sm:px-6">Fidelity Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-semibold text-[#161618]">
                
                {/* Row 1: Documents */}
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-5 px-5 sm:px-6 flex items-center gap-2.5 font-extrabold text-[#161618]">
                    <ApplePagesIcon className="w-6 h-6 shrink-0" />
                    <span>Documents</span>
                  </td>
                  <td className="py-5 px-5 sm:px-6 text-[#52525B] font-medium">.pages, .docx, .pdf</td>
                  <td className="py-5 px-5 sm:px-6 text-[#71717A] font-medium">Pages ↔ Word ↔ PDF</td>
                  <td className="py-5 px-5 sm:px-6 text-emerald-600 font-extrabold text-xs sm:text-sm">
                    100% Native Vector
                  </td>
                </tr>

                {/* Row 2: Spreadsheets */}
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-5 px-5 sm:px-6 flex items-center gap-2.5 font-extrabold text-[#161618]">
                    <AppleNumbersIcon className="w-6 h-6 shrink-0" />
                    <span>Spreadsheets</span>
                  </td>
                  <td className="py-5 px-5 sm:px-6 text-[#52525B] font-medium">.numbers, .xlsx, .csv</td>
                  <td className="py-5 px-5 sm:px-6 text-[#71717A] font-medium">Numbers ↔ Excel ↔ CSV</td>
                  <td className="py-5 px-5 sm:px-6 text-emerald-600 font-extrabold text-xs sm:text-sm">
                    Calculated Grid Preserved
                  </td>
                </tr>

                {/* Row 3: Presentations */}
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-5 px-5 sm:px-6 flex items-center gap-2.5 font-extrabold text-[#161618]">
                    <AppleKeynoteIcon className="w-6 h-6 shrink-0" />
                    <span>Presentations</span>
                  </td>
                  <td className="py-5 px-5 sm:px-6 text-[#52525B] font-medium">.key, .pptx, .pdf</td>
                  <td className="py-5 px-5 sm:px-6 text-[#71717A] font-medium">Keynote ↔ PowerPoint ↔ PDF</td>
                  <td className="py-5 px-5 sm:px-6 text-emerald-600 font-extrabold text-xs sm:text-sm">
                    16:9 Cinema Slides
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. How to Convert in 5 Simple Steps */}
      {/* 8. How to Convert in 5 Simple Steps (1:1 AVERO Reference Style) */}
      <section id="how-it-works" className="max-w-5xl mx-auto w-full px-4 py-14 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#161618] tracking-tight">
            How to Convert in 5 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-medium">
            From dropping your document to instant high-resolution passage, the workflow is fast, free, and seamless.
          </p>
        </div>

        {/* 1:1 AVERO 5-Step Process Container */}
        <div className="avero-clay-card p-6 sm:p-10 relative overflow-hidden border border-white/90">
          
          {/* Connector Line behind 3D spheres (Desktop) */}
          <div className="hidden md:block absolute top-[68px] left-[10%] right-[10%] h-[2px] bg-black/10 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-4 relative z-10">
            
            {/* Step 1: Copy Link / Select File */}
            <div className="space-y-4 flex flex-col items-center text-center group">
              <div className="w-9 h-9 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center font-extrabold text-xs text-[#161618] border border-white/80 shrink-0">
                1
              </div>
              <div className="w-full avero-inset-bar rounded-2xl h-24 p-3 flex items-center justify-center border border-white/40 shadow-inner group-hover:border-white/60 transition-all">
                <div className="w-full h-11 rounded-xl bg-white border border-emerald-500/30 shadow-2xs px-2.5 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-semibold text-emerald-600 truncate">document.pages</span>
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-[#161618]">Select File</h4>
                <p className="text-[11px] text-[#71717A] leading-relaxed font-medium">Drop your document or choose files from your device.</p>
              </div>
            </div>

            {/* Step 2: Open Portal */}
            <div className="space-y-4 flex flex-col items-center text-center group">
              <div className="w-9 h-9 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center font-extrabold text-xs text-[#161618] border border-white/80 shrink-0">
                2
              </div>
              <div className="w-full avero-inset-bar rounded-2xl h-24 p-3 flex items-center justify-center border border-white/40 shadow-inner group-hover:border-white/60 transition-all">
                <div className="w-full h-11 rounded-xl bg-white border border-black/10 shadow-2xs px-2.5 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#161618] truncate">THE PORT</span>
                  <div className="w-4 h-4 rounded-full bg-[#161618] text-white flex items-center justify-center shrink-0">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-[#161618]">Auto Detect</h4>
                <p className="text-[11px] text-[#71717A] leading-relaxed font-medium">Automatic format and passage mode routing.</p>
              </div>
            </div>

            {/* Step 3: Choose Target */}
            <div className="space-y-4 flex flex-col items-center text-center group">
              <div className="w-9 h-9 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center font-extrabold text-xs text-[#161618] border border-white/80 shrink-0">
                3
              </div>
              <div className="w-full avero-inset-bar rounded-2xl h-24 p-3 flex items-center justify-center border border-white/40 shadow-inner group-hover:border-white/60 transition-all">
                <div className="w-full h-11 rounded-xl bg-white border border-amber-500/30 shadow-2xs px-2.5 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-medium text-[#71717A] truncate">.pages → .docx</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E8A23D] text-white text-[9px] font-extrabold shrink-0">Passage</span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-[#161618]">Choose Target</h4>
                <p className="text-[11px] text-[#71717A] leading-relaxed font-medium">Select .docx, .pages, .pptx, or .pdf format.</p>
              </div>
            </div>

            {/* Step 4: Quality & M1 Pass */}
            <div className="space-y-4 flex flex-col items-center text-center group">
              <div className="w-9 h-9 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center font-extrabold text-xs text-[#161618] border border-white/80 shrink-0">
                4
              </div>
              <div className="w-full avero-inset-bar rounded-2xl h-24 p-2.5 flex flex-col justify-center border border-white/40 shadow-inner group-hover:border-white/60 transition-all">
                <div className="w-full space-y-1">
                  <div className="h-5 rounded-md bg-white border border-emerald-500/20 px-2 flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-[#52525B]">100% Vector</span>
                    <span className="px-1.5 py-0.2 bg-[#10B981] text-white rounded text-[8px] font-bold">Pass</span>
                  </div>
                  <div className="h-5 rounded-md bg-white border border-emerald-500/20 px-2 flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-[#52525B]">M1 Silicon</span>
                    <span className="px-1.5 py-0.2 bg-[#10B981] text-white rounded text-[8px] font-bold">Native</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-[#161618]">Native M1 Pass</h4>
                <p className="text-[11px] text-[#71717A] leading-relaxed font-medium">Apple Silicon M1 engine zero-loss export pipeline.</p>
              </div>
            </div>

            {/* Step 5: Download & Save */}
            <div className="space-y-4 flex flex-col items-center text-center group">
              <div className="w-9 h-9 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center font-extrabold text-xs text-[#161618] border border-white/80 shrink-0">
                5
              </div>
              <div className="w-full avero-inset-bar rounded-2xl h-24 p-3 flex items-center justify-center border border-white/40 shadow-inner group-hover:border-white/60 transition-all">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-2xs">
                    <ArrowRight className="w-3 h-3 rotate-90 stroke-[3]" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#10B981]" />
                  <div className="p-1.5 rounded-lg bg-white border border-black/10 shadow-2xs flex items-center gap-1">
                    <ApplePagesIcon className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold text-[#161618]">.docx</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-[#161618]">Download & Scan</h4>
                <p className="text-[11px] text-[#71717A] leading-relaxed font-medium">Instant download or QR phone scan to mobile.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Share Card (Compact Sleek 3D Clay Style) */}
      <section className="max-w-xl mx-auto w-full px-4 py-6">
        <div className="avero-clay-card p-5 sm:p-7 text-center space-y-4 border border-white">
          <h3 className="text-base sm:text-lg font-extrabold text-[#161618] tracking-tight">
            Love using THE PORT? Share with friends!
          </h3>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="avero-light-glossy text-[#161618] px-4.5 sm:px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap inline-flex items-center justify-center gap-1.5 hover:scale-[1.03] active:scale-95 transition-all shadow-2xs"
            >
              <span>Share on X / Twitter</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare('whatsapp')}
              className="avero-light-glossy text-[#161618] px-4.5 sm:px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap inline-flex items-center justify-center gap-1.5 hover:scale-[1.03] active:scale-95 transition-all shadow-2xs"
            >
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare('copy')}
              className="avero-light-glossy text-[#161618] px-4.5 sm:px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap inline-flex items-center justify-center gap-1.5 hover:scale-[1.03] active:scale-95 transition-all shadow-2xs"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-[#161618]" />}
              <span>{copiedShare ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. True Full-Width Connected Soft Clay Footer */}
      <footer className="w-full bg-[#ECECEF] border-t-2 border-white shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_-6px_24px_rgba(0,0,0,0.03)] mt-12 sm:mt-16 py-8 sm:py-12 px-5 sm:px-8 md:px-12 text-[#161618] relative z-20">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-black/5">
            
            {/* Column 1: Brand & M1 Engine Badge */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center justify-between sm:justify-start gap-2.5">
                <a href="#home" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-[#1E1E22] text-white flex items-center justify-center text-xs shadow-md border border-white/20">
                    ⛩️
                  </div>
                  <ThePortLogo className="h-4 w-auto" />
                </a>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>M1 Active</span>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-[#71717A] leading-relaxed font-medium">
                Universal Apple iWork & Office passage engine on Apple Silicon.
              </p>
            </div>

            {/* Column 2: Passage Tools */}
            <div className="space-y-2.5 text-xs">
              <h5 className="font-black text-[#161618] uppercase text-[10px] sm:text-[11px] tracking-wider">Tools</h5>
              <ul className="space-y-1.5 text-[#71717A] font-medium text-[11px] sm:text-xs">
                <li><button onClick={() => onSelectSample('pages')} className="hover:text-[#161618] transition-colors">Pages to Word</button></li>
                <li><button onClick={() => onSelectSample('key')} className="hover:text-[#161618] transition-colors">Keynote to PPT</button></li>
                <li><button onClick={() => onSelectSample('numbers')} className="hover:text-[#161618] transition-colors">Numbers to Excel</button></li>
                <li><button onClick={() => onSelectSample('pdf')} className="hover:text-[#161618] transition-colors">PDF to Pages</button></li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-2.5 text-xs">
              <h5 className="font-black text-[#161618] uppercase text-[10px] sm:text-[11px] tracking-wider">Platform</h5>
              <ul className="space-y-1.5 text-[#71717A] font-medium text-[11px] sm:text-xs">
                <li><a href="#home" className="hover:text-[#161618] transition-colors">Home Portal</a></li>
                <li><a href="#tools" className="hover:text-[#161618] transition-colors">Passage Tools</a></li>
                <li><a href="#formats" className="hover:text-[#161618] transition-colors">Format Matrix</a></li>
                <li><a href="#how-it-works" className="hover:text-[#161618] transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Column 4: Privacy & Security */}
            <div className="col-span-2 md:col-span-1 space-y-2.5 text-xs">
              <h5 className="font-black text-[#161618] uppercase text-[10px] sm:text-[11px] tracking-wider">Security</h5>
              <ul className="space-y-1.5 text-[#71717A] font-medium text-[11px] sm:text-xs grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-0">
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Zero-Log Policy</span>
                </li>
                <li><span>24-Hour Auto-Wipe</span></li>
                <li><span>Native Sandbox</span></li>
                <li><span>100% Private</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-semibold text-[#71717A] text-center sm:text-left">
            <p>© 2026 THE PORT. Universal Document Passage • Native Apple Silicon.</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-black/5 text-[10px] sm:text-[11px] font-bold text-[#161618] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
