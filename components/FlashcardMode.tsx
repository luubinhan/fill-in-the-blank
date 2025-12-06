import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sentence } from '../types';
import { RotateCw, Check, X, RefreshCcw } from 'lucide-react';

interface FlashcardModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ data, levelName, onExit }) => {
  const [cards, setCards] = useState<Sentence[]>(data);
  const [swipedCards, setSwipedCards] = useState<{ id: string; result: 'remembered' | 'review' }[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCards(data);
    setSwipedCards([]);
    setIsFlipped(false);
  }, [data]);

  const activeCard = cards[0];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!activeCard) return;
    const result = direction === 'right' ? 'remembered' : 'review';
    setSwipedCards(prev => [...prev, { id: activeCard.id, result }]);
    setIsFlipped(false);
    setCards(prev => prev.slice(1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCard) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); handleSwipe('right'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handleSwipe('left'); }
      else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setIsFlipped(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard, cards]);

  const handleRestart = () => {
    setCards(data);
    setSwipedCards([]);
    setIsFlipped(false);
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]); // Subtle rotation
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const cardBg = useTransform(x, [-150, 0, 150], ['rgb(254, 242, 242)', 'rgb(255, 255, 255)', 'rgb(240, 253, 244)']);

  const rememberedCount = swipedCards.filter(s => s.result === 'remembered').length;

  // Header Component for the game mode
  const GameHeader = () => (
    <div className="w-full max-w-md mx-auto px-6 py-4 flex justify-between items-center">
      <button 
        onClick={onExit}
        className="text-blue-600 font-bold text-sm tracking-wider hover:opacity-70 transition-opacity uppercase"
      >
        Quit
      </button>
      <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Flashcards</span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1">{levelName}</span>
      </div>
    </div>
  );

  if (!activeCard) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Great Job!</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                You've completed the set. You mastered <strong className="text-blue-600">{rememberedCount}</strong> out of {data.length} sentences.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
                <button 
                    onClick={handleRestart}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold tracking-wider uppercase shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={18} /> Play Again
                </button>
                <button 
                    onClick={onExit}
                    className="w-full py-4 bg-white text-slate-400 font-bold tracking-wider uppercase hover:text-slate-600 transition-colors"
                >
                    Back to Modes
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <GameHeader />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pb-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((swipedCards.length) / (data.length)) * 100}%` }}
            />
        </div>

        <div className="flex-1 relative flex items-center justify-center perspective-1000 min-h-[360px]">
            <AnimatePresence>
                <motion.div
                key={activeCard.id}
                style={{ x, rotate, opacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={() => setDragStart({ x: 0, y: 0 })}
                onDragEnd={(e, info) => {
                    if (info.offset.x > 100) handleSwipe('right');
                    else if (info.offset.x < -100) handleSwipe('left');
                }}
                className="absolute w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing perspective-1000"
                >
                <div 
                    className="relative w-full h-full duration-500 transform-style-3d transition-transform"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <motion.div 
                    style={{ backgroundColor: cardBg }}
                    className="absolute w-full h-full backface-hidden rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <h3 className="text-3xl font-bold text-slate-800 leading-tight">
                            {activeCard.english}
                        </h3>
                        <div className="absolute bottom-8 text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                            <RotateCw size={12} /> Tap to flip
                        </div>
                    </motion.div>

                    {/* Back */}
                    <div 
                    className="absolute w-full h-full backface-hidden rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 bg-indigo-50 flex flex-col items-center justify-center p-8 text-center"
                    style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="mb-6 pb-6 border-b border-indigo-100/50 w-full">
                            <p className="text-lg text-indigo-400/60 font-medium italic">
                            "{activeCard.english}"
                            </p>
                        </div>
                        <h3 className="text-2xl font-bold text-indigo-900 leading-relaxed">
                            {activeCard.translation}
                        </h3>
                        <div className="absolute bottom-8 text-indigo-300 text-xs uppercase tracking-widest flex items-center gap-2">
                            <RotateCw size={12} /> Tap to flip back
                        </div>
                    </div>
                </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-8">
            <button 
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:scale-105 transition-all group"
            >
                <X className="w-6 h-6 text-slate-300 group-hover:text-red-500 transition-colors" />
            </button>
            
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Swipe</div>

            <button 
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all"
            >
                <Check className="w-8 h-8 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;