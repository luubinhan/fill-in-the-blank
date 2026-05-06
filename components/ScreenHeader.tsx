import { LayoutGrid, Mic } from 'lucide-react';
import React from 'react';

export interface ScreenHeaderProps {
  onSpeakingClick: () => void;
  onHomeClick: () => void;
  view?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ onSpeakingClick, onHomeClick, view }) => (
  <div className="flex justify-between items-center mb-10 pt-4">
    <div className="flex items-center gap-4">
      <div className={`${
        view === 'levels' ? 'text-violet-400' : 'text-zinc-400 hover:text-violet-400'} 
        transition-colors cursor-pointer`}
        onClick={onHomeClick}
      >
        <LayoutGrid size={24} onClick={onHomeClick} className="cursor-pointer" />
      </div>
    </div>
    <div>
      <button
        onClick={onSpeakingClick}
        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${
          view === 'speaking' ? 'text-violet-400' : 'text-zinc-400 hover:text-violet-400'
        }`}
      >
        <Mic size={18} />
        Speaking
      </button>
    </div>
  </div>
);

export default ScreenHeader;
