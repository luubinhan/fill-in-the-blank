import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sentence } from '../types';
import { RotateCw, Check, X, RefreshCcw, ChevronLeft } from 'lucide-react';

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
  // Use dark colors for card background interpolation if needed, or static
  const cardBg = useTransform(x, [-150, 0, 150], ['rgb(39, 39, 42)', 'rgb(39, 39, 42)', 'rgb(39, 39, 42)']);

  const rememberedCount = swipedCards.filter(s => s.result === 'remembered').length;

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

  if (!activeCard) {
    return (
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 max-w-md mx-auto w-full">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                You mastered <strong className="text-indigo-400">{rememberedCount}</strong> out of {data.length} cards.
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
                    className="absolute w-full h-full backface-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <h3 className="text-3xl font-bold text-white leading-tight">
                            {activeCard.english}
                        </h3>
                        <div className="absolute bottom-8 text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                            <RotateCw size={12} /> Tap to flip
                        </div>
                    </motion.div>

                    {/* Back */}
                    <div 
                    className="absolute w-full h-full backface-hidden rounded-[2rem] bg-indigo-600 flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-indigo-900/50"
                    style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="mb-6 pb-6 border-b border-indigo-400/30 w-full">
                            <p className="text-lg text-indigo-200 font-medium italic">
                            "{activeCard.english}"
                            </p>
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-relaxed">
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
            className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-rose-900/20 hover:border-rose-900 hover:scale-105 transition-all group"
            >
                <X className="w-6 h-6 text-zinc-500 group-hover:text-rose-500 transition-colors" />
            </button>
            
            <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Swipe</div>

            <button 
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-indigo-600 shadow-lg shadow-indigo-900/50 flex items-center justify-center hover:bg-indigo-500 hover:scale-105 transition-all"
            >
                <Check className="w-8 h-8 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;