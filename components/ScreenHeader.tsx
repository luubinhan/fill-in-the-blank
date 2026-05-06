import { LayoutGrid, Mic } from 'lucide-react';
import React from 'react';

export interface ScreenHeaderProps {
  onSpeakingClick: () => void;
  onHomeClick: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ onSpeakingClick, onHomeClick }) => (
  <div className="flex justify-between items-center mb-10 pt-4">
    <div className="flex items-center gap-4">
      <div className="text-zinc-400">
        <LayoutGrid size={24} onClick={onHomeClick} className="cursor-pointer" />
      </div>
    </div>
    <div>
      <button
        onClick={onSpeakingClick}
        className="flex items-center gap-2 text-zinc-400 hover:text-violet-400 transition-colors text-sm font-bold uppercase tracking-wider"
      >
        <Mic size={18} />
        Speaking
      </button>
    </div>
  </div>
);

export default ScreenHeader;
