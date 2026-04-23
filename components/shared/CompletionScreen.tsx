import React from 'react';
import { RefreshCcw, ArrowRight, Shuffle } from 'lucide-react';

interface CompletionScreenProps {
  totalQuestions: number;
  score?: number;
  onRestart: () => void;
  onExit: () => void;
  onNextGame?: () => void;
  onAnotherLevel?: () => void;
  mode: 'flashcards' | 'quiz';
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  totalQuestions, 
  score, 
  onRestart, 
  onExit,
  onNextGame,
  onAnotherLevel,
  mode 
}) => {
  const isQuizMode = mode === 'quiz';
  const emoji = isQuizMode ? '🏆' : '🎉';
  const bgColor = isQuizMode ? 'bg-emerald-500/20' : 'bg-indigo-500/20';
  const scoreColor = 'text-emerald-400';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 bg-black min-h-dvh">
      <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
        <span className="text-4xl">{emoji}</span>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2">
        {isQuizMode ? 'Practice Complete!' : 'Session Complete!'}
      </h2>
      
      <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
        {isQuizMode ? (
          <>You scored <span className={`${scoreColor} font-bold`}>{score}</span> out of {totalQuestions}.</>
        ) : (
          <>You have reviewed all <strong className="text-indigo-400">{totalQuestions}</strong> cards.</>
        )}
      </p>
      
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
