import React, { useMemo } from 'react';
import { Level, GameMode } from '../types';
import { SPEAKING_LEVELS } from '../data/speaking-placeholder';
import { Layers, PenTool } from 'lucide-react';

interface SpeakingViewProps {
  onSelectLevel: (level: Level, mode: GameMode) => void;
}

const levelBadgePalette = [
  'bg-rose-500/15 text-rose-300',
  'bg-amber-500/15 text-amber-300',
  'bg-emerald-500/15 text-emerald-300',
  'bg-cyan-500/15 text-cyan-300',
  'bg-sky-500/15 text-sky-300',
  'bg-fuchsia-500/15 text-fuchsia-300',
  'bg-lime-500/15 text-lime-300',
];

const SpeakingView: React.FC<SpeakingViewProps> = ({ onSelectLevel }) => {
  const randomColors = useMemo(
    () => SPEAKING_LEVELS.map(() => levelBadgePalette[Math.floor(Math.random() * levelBadgePalette.length)]),
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {SPEAKING_LEVELS.map((level, idx) => (
        <div
          key={idx}
          className="bg-zinc-900 border border-zinc-800 text-left p-6 rounded-2xl transition-all"
        >
          <div className="flex items-center mb-4">
            <div className={`text-2xl ${randomColors[idx]} mr-4 font-bold rounded-full w-10 h-10 flex items-center justify-center`}>
              {level.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white mb-1">
                {level.name}
              </span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                {level.sentences.length} Cards • {level.difficulty}
              </span>
            </div>
          </div>

          {/* Mode Selection Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelectLevel(level, 'flashcards')}
              className="bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 p-4 rounded-xl transition-all flex flex-col items-center gap-2"
            >
              <Layers size={20} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400">Flashcards</span>
            </button>

            <button
              onClick={() => onSelectLevel(level, 'fill-blank')}
              className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 p-4 rounded-xl transition-all flex flex-col items-center gap-2"
            >
              <PenTool size={20} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Quiz Mode</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpeakingView;
