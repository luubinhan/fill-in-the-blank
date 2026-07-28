import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface GameHeaderProps {
  onExit: () => void;
  levelName: string;
  modeName?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onExit, levelName, modeName }) => (
  <div className="w-full max-w-md mx-auto px-6 py-4 flex justify-between items-center pt-8">
    <button 
      onClick={onExit}
      className="text-zinc-400 hover:text-white transition-colors"
    >
      <LayoutGrid size={24} />
    </button>
    <div className="flex flex-col items-end">
      {modeName && (
        <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">{modeName}</span>
      )}
      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full mt-1 border border-zinc-800">
        {levelName}
      </span>
    </div>
  </div>
);

export default GameHeader;
