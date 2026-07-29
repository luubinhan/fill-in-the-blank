import React from 'react';
import { RefreshCcw, ArrowRight, Shuffle } from 'lucide-react';

export type IncorrectItem = {
  prompt: string;
  correctAnswer: string;
};

interface CompletionScreenProps {
  totalQuestions: number;
  score?: number;
  onRestart: () => void;
  onExit: () => void;
  onNextGame?: () => void;
  onAnotherLevel?: () => void;
  mode: 'flashcards' | 'quiz';
  incorrectItems?: IncorrectItem[];
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  totalQuestions,
  score,
  onRestart,
  onExit,
  onNextGame,
  onAnotherLevel,
  mode,
  incorrectItems = [],
}) => {
  const isQuizMode = mode === 'quiz';
  const emoji = isQuizMode ? '🏆' : '🎉';
  const bgColor = isQuizMode ? 'bg-emerald-500/20' : 'bg-indigo-500/20';
  const scoreColor = 'text-emerald-400';
  const showMissed = isQuizMode && incorrectItems.length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 bg-black min-h-dvh">
      <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
        <span className="text-4xl">{emoji}</span>
      </div>
      <p className={`text-zinc-400 max-w-xs mx-auto ${showMissed ? 'mb-4' : 'mb-8'}`}>
        {isQuizMode ? (
          <>You scored <span className={`${scoreColor} font-bold`}>{score}</span> out of {totalQuestions}.</>
        ) : (
          <>You have reviewed all <strong className="text-indigo-400">{totalQuestions}</strong> cards.</>
        )}
      </p>

      {showMissed && (
        <div className="w-full scrollbar-thumb-indigo-700 scrollbar-track-gray-100/10 max-w-xs mb-8 text-left max-h-48 overflow-y-auto ">
          <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Missed</p>
          <ul className="space-y-3">
            {incorrectItems.map((item, index) => (
              <li key={`${item.prompt}-${item.correctAnswer}-${index}`} className="border-b border-zinc-800 pb-3 last:border-0">
                <p className="text-sm text-zinc-400 break-words">{item.prompt}</p>
                <p className="text-sm text-emerald-400 font-bold mt-1 break-words">{item.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={onRestart}
          className={`w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2`}
        >
          <RefreshCcw size={18} /> {isQuizMode ? 'Try Again' : 'Review Again'}
        </button>

        {onNextGame && (
          <button 
            onClick={onNextGame}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold tracking-wider uppercase hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} /> Next
          </button>
        )}

        {onAnotherLevel && (
          <button 
            onClick={onAnotherLevel}
            className="w-full py-4 bg-amber-400 border border-amber-600 text-white rounded-2xl font-bold tracking-wider uppercase hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
          >
            <Shuffle size={18} /> Another topic
          </button>
        )}
        
        <button 
          onClick={onExit}
          className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 font-bold tracking-wider uppercase hover:text-white hover:bg-zinc-800 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
