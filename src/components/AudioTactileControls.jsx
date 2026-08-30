import React, { useState } from 'react';
import { Volume2, VolumeX, Keyboard, Sparkles, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function AudioTactileControls() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playSnap();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
          audioEnabled 
            ? 'bg-white/10 border-white/20 text-white' 
            : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
        }`}
        title={audioEnabled ? 'Mute tactile synthesizer' : 'Enable tactile synthesizer'}
      >
        {audioEnabled ? <Volume2 className="w-4 h-4 text-[#E8A23D]" /> : <VolumeX className="w-4 h-4" />}
        <span className="hidden sm:inline">{audioEnabled ? 'Sound On' : 'Muted'}</span>
      </button>

      {/* Keyboard Shortcuts Hint */}
      <div className="relative">
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-mono flex items-center gap-1.5"
          title="Keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden md:inline">Shortcuts</span>
        </button>

        {showShortcuts && (
          <div className="absolute right-0 bottom-full mb-2 w-64 p-4 rounded-2xl bg-[#15161C] border border-white/15 shadow-2xl space-y-2 text-xs font-mono z-50">
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 text-slate-300 font-bold">
              <span>KEYBOARD SHORTCUTS</span>
              <span className="text-[10px] text-slate-500">PORT ENGINE</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Trigger Passage</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Space</kbd>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Load Sample</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">1 / 2 / 3</kbd>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Toggle Audio</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">M</kbd>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
