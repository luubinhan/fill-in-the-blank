import React, { useState, useEffect, useCallback } from 'react';
import { Sentence } from '../types';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import GameHeader from './shared/GameHeader';
import CompletionScreen from './shared/CompletionScreen';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { Flashcard, useFlashcard } from 'react-quizlet-flashcard';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore - package CSS side-effect import has no type declarations
import 'react-quizlet-flashcard/dist/index.css';

interface FlashcardModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
  onNextGame: () => void;
  onAnotherLevel?: () => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ data, levelName, onExit, onNextGame, onAnotherLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const flashcardRef = React.useRef<HTMLDivElement>(null);
  const flipHook = useFlashcard({});

  useEffect(() => {
    setCurrentIndex(0);
    setCompleted(false);
  }, [data]);

  const activeCard = data[currentIndex];

  const handleNext = useCallback(() => {
    setDirection('forward');
    if (currentIndex < data.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, data.length]);

  const handlePrev = useCallback(() => {
    setDirection('backward');
    if (currentIndex > 0) {
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  }, [currentIndex]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
  };

  const handleFlip = useCallback(() => {
    // Programmatically trigger click on flashcard for keyboard navigation
    if (flashcardRef.current) {
      const clickableElement = flashcardRef.current.querySelector('[class*="flashcard"]');
      if (clickableElement) {
        (clickableElement as HTMLElement).click();
      }
    }
    flipHook.flip();
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleNext,
    onPrev: handlePrev,
    onFlip: handleFlip,
    disabled: completed,
    enablePrev: currentIndex > 0,
    isFinished: completed,
    onNextGame,
  });

  if (completed) {
    return (
      <CompletionScreen
        totalQuestions={data.length}
        onRestart={handleRestart}
        onExit={onExit}
        mode="flashcards"
        onNextGame={onNextGame}
        onAnotherLevel={onAnotherLevel}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black min-h-dvh">
      <GameHeader onExit={onExit} levelName={levelName} modeName="Flashcards" />

      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 pb-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-900 rounded-full mb-8 overflow-hidden">
            <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
            />
        </div>

        <div className="flex-1 relative flex items-center justify-center min-h-[360px]">
          <div ref={flashcardRef} className="w-full h-80 sm:h-96">
            
            {/* React Quizlet Flashcard with Framer Motion */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{
                  x: direction === 'forward' ? 100 : -100,
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  x: direction === 'forward' ? -100 : 100,
                  opacity: 0,
                  scale: 0.95
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="w-full h-full"
              >
                <Flashcard
                  style={{ width: '100%' }}
                  flipHook={flipHook}
                  front={{
                    html: (
                      <div className="bg-indigo-600 shadow-2xl shadow-indigo-900/50 flex flex-col items-center justify-center p-8 text-center w-full h-full rounded-2xl">
                        <h3 className="text-3xl font-bold text-white leading-tight select-none">
                          {activeCard?.english}
                        </h3>
                        <div className="mt-8 text-indigo-300 text-xs uppercase tracking-widest flex items-center gap-2">
                          <RotateCw size={12} /> Tap to flip <span className="hidden sm:inline">(Space)</span>
                        </div>
                      </div>
                    )
                  }}
                  back={{
                    html: (
                      <div className="bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-8 text-center w-full h-full rounded-2xl">
                        <div className="mb-6 pb-6 border-b border-zinc-400/30 w-full">
                          <p className="text-lg text-zinc-500 font-medium italic select-none">
                            "{activeCard?.english}"
                          </p>
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-relaxed select-none">
                          {activeCard?.translation}
                        </h3>
                        <div className="mt-8 text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <RotateCw size={12} /> Tap to flip back
                        </div>
                      </div>
                    )
                  }}
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
            <button 
              onClick={handlePrev}
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
              onClick={handleNext}
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