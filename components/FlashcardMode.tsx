import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sentence } from '../types';
import { RotateCw, CheckCircle, XCircle, RefreshCcw, Home, ArrowLeft, ArrowRight } from 'lucide-react';

interface FlashcardModeProps {
  data: Sentence[];
  onExit: () => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ data, onExit }) => {
  const [cards, setCards] = useState<Sentence[]>(data);
  const [swipedCards, setSwipedCards] = useState<{ id: string; result: 'remembered' | 'review' }[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when data changes
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
    
    // Remove current card
    setCards(prev => prev.slice(1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCard) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('left');
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard, cards]); // Depend on activeCard/cards so handleSwipe has correct context

  const handleRestart = () => {
    setCards(data);
    setSwipedCards([]);
    setIsFlipped(false);
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  // Background color indicators based on swipe position
  const cardBg = useTransform(
    x, 
    [-150, 0, 150], 
    ['rgb(254, 226, 226)', 'rgb(255, 255, 255)', 'rgb(220, 252, 231)']
  );

  const rememberedCount = swipedCards.filter(s => s.result === 'remembered').length;
  const reviewCount = swipedCards.filter(s => s.result === 'review').length;

  if (!activeCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in duration-500">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Great Job!</h2>
        <p className="text-slate-600 mb-8 text-lg">You finished the deck.</p>
        
        <div className="flex gap-4 mb-8 w-full max-w-sm">
          <div className="flex-1 bg-green-100 p-4 rounded-2xl border border-green-200">
            <div className="text-3xl font-bold text-green-600">{rememberedCount}</div>
            <div className="text-sm text-green-700 font-semibold">Mastered</div>
          </div>
          <div className="flex-1 bg-orange-100 p-4 rounded-2xl border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">{reviewCount}</div>
            <div className="text-sm text-orange-700 font-semibold">Review</div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-xs gap-3">
          <button 
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all"
          >
            <RefreshCcw size={20} /> Play Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 rounded-xl font-bold text-lg border-2 border-slate-200"
          >
            Choose Another Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[600px] flex flex-col py-4">
      {/* Exit Button */}
      <div className="flex justify-start mb-4">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <Home size={18} /> Exit Lesson
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-blue-400 transition-all duration-300 ease-out"
          style={{ width: `${((swipedCards.length) / (data.length)) * 100}%` }}
        />
      </div>

      <div className="text-center mb-4 text-slate-500 font-semibold">
        Card {swipedCards.length + 1} of {data.length}
      </div>

      <div className="flex-1 relative flex items-center justify-center perspective-1000 min-h-[400px]">
        <AnimatePresence>
            <motion.div
              key={activeCard.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={() => setDragStart({ x: 0, y: 0 })} // Reset isn't strictly needed but good for logic
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                  handleSwipe('right');
                } else if (info.offset.x < -100) {
                  handleSwipe('left');
                }
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
                  className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    English
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 leading-tight">
                    {activeCard.english}
                  </h3>
                  <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-1">
                    <RotateCw size={14} /> Tap to flip
                  </div>
                </motion.div>

                {/* Back */}
                <div 
                  className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl border-4 border-white bg-indigo-50 flex flex-col items-center justify-center p-8 text-center"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Meaning
                  </div>
                  
                  {/* English reference on the back */}
                  <div className="mb-4 pb-4 border-b border-indigo-100 w-full">
                    <p className="text-lg text-indigo-400 font-medium opacity-75">
                      {activeCard.english}
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold text-indigo-900 leading-relaxed">
                    {activeCard.translation}
                  </h3>
                  
                   <div className="absolute bottom-6 text-indigo-300 text-sm flex items-center gap-1">
                    <RotateCw size={14} /> Tap to flip back
                  </div>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button 
          onClick={() => handleSwipe('left')}
          className="flex flex-col items-center gap-1 group"
          title="Press Left Arrow"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-200 shadow-sm flex items-center justify-center group-hover:bg-orange-50 group-hover:scale-110 transition-all">
            <XCircle className="w-8 h-8 text-orange-400" />
          </div>
          <span className="text-xs font-bold text-orange-300 uppercase tracking-wide flex items-center gap-1">
            <ArrowLeft size={12} /> Review
          </span>
        </button>

        <div className="text-slate-300 font-bold text-sm">VS</div>

        <button 
          onClick={() => handleSwipe('right')}
           className="flex flex-col items-center gap-1 group"
           title="Press Right Arrow"
        >
           <div className="w-16 h-16 rounded-full bg-white border-2 border-green-200 shadow-sm flex items-center justify-center group-hover:bg-green-50 group-hover:scale-110 transition-all">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <span className="text-xs font-bold text-green-300 uppercase tracking-wide flex items-center gap-1">
            Got it! <ArrowRight size={12} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;