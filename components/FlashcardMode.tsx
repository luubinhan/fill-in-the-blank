import React, { useState, useEffect, useCallback } from 'react';
import { Sentence } from '../types';
import { RotateCw, RefreshCcw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface FlashcardModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ data, levelName, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setCompleted(false);
    setIsFlipped(false);
  }, [data]);

  const activeCard = data[currentIndex];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < data.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, data.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  }, [currentIndex]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); // Prevent scrolling
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, completed]);

  // Header Component for the game mode
  const GameHeader = () => (
    <div className="w-full max-w-md mx-auto px-6 py-4 flex justify-between items-center pt-8">
      <button 
        onClick={onExit}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Flashcards</span>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full mt-1 border border-zinc-800">{levelName}</span>
      </div>
    </div>
  );

  if (completed) {
    return (
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 max-w-md mx-auto w-full">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                You have reviewed all <strong className="text-indigo-400">{data.length}</strong> cards.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
                <button 
                    onClick={handleRestart}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold tracking-wider uppercase hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={18} /> Review Again
                </button>
                <button 
                    onClick={onExit}
                    className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold tracking-wider uppercase hover:text-white hover:bg-zinc-800 transition-all"
                >
                    Done
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black">
      <GameHeader />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pb-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-900 rounded-full mb-8 overflow-hidden">
            <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-[360px]">
          <div className="w-full h-80 sm:h-96">
            
            {/* Manual Flashcard Implementation */}
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-inner">
                {/* Front */}
                <div className="flashcard-front bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
                   <h3 className="text-3xl font-bold text-white leading-tight select-none">
                    {activeCard?.english}
                   </h3>
                   <div className="mt-8 text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                     <RotateCw size={12} /> Tap to flip <span className="hidden sm:inline">(Space)</span>
                   </div>
                </div>

                {/* Back */}
                <div className="flashcard-back bg-indigo-600 shadow-2xl shadow-indigo-900/50 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6 pb-6 border-b border-indigo-400/30 w-full">
                    <p className="text-lg text-indigo-200 font-medium italic select-none">
                      "{activeCard?.english}"
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-relaxed select-none">
                    {activeCard?.translation}
                  </h3>
                  <div className="mt-8 text-indigo-300 text-xs uppercase tracking-widest flex items-center gap-2">
                    <RotateCw size={12} /> Tap to flip back
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentIndex === 0}
              className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
              title="Previous Card (Left Arrow)"
            >
                <ChevronLeft className="w-6 h-6" />
                <span className="ml-2 font-bold uppercase tracking-wider text-sm">Prev</span>
            </button>
            
            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-2">
               {currentIndex + 1} / {data.length}
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/30 flex items-center justify-center text-white hover:bg-indigo-500 transition-all"
              title="Next Card (Right Arrow)"
            >
                <span className="mr-2 font-bold uppercase tracking-wider text-sm">
                  {currentIndex === data.length - 1 ? 'Finish' : 'Next'}
                </span>
                {currentIndex === data.length - 1 ? <CheckCircle className="w-5 h-5" /> : <ChevronRight className="w-6 h-6" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;