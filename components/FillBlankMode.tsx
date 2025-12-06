import React, { useState, useEffect, useRef } from 'react';
import { Sentence } from '../types';
import { RefreshCcw, Check, X, ArrowRight, ChevronLeft } from 'lucide-react';

interface FillBlankModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
}

interface QuestionState {
  sentenceId: string;
  parts: string[];
  hiddenWordIndex: number;
  hiddenWord: string;
  userAnswer: string;
  isCorrect: boolean | null;
  isSubmitted: boolean;
}

const FillBlankMode: React.FC<FillBlankModeProps> = ({ data, levelName, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<QuestionState | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prepareQuestion = (sentence: Sentence): QuestionState => {
    const words = sentence.english.split(' ');
    const candidates = words.map((w, i) => ({ w, i })).filter(item => item.w.replace(/[^a-zA-Z]/g, '').length > 1);
    const target = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : { w: words[0], i: 0 };
    const cleanTargetWord = target.w.replace(/[.,!?;:"']/g, '');

    return {
      sentenceId: sentence.id,
      parts: words,
      hiddenWordIndex: target.i,
      hiddenWord: cleanTargetWord,
      userAnswer: '',
      isCorrect: null,
      isSubmitted: false
    };
  };

  useEffect(() => {
    if (currentIndex < data.length) {
      setGameState(prepareQuestion(data[currentIndex]));
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameState || gameState.isSubmitted) return;
    const isCorrect = gameState.userAnswer.toLowerCase().trim() === gameState.hiddenWord.toLowerCase();
    setGameState(prev => prev ? { ...prev, isCorrect, isSubmitted: true } : null);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
    setIsFinished(false);
  };

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
          <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Quiz</span>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full mt-1 border border-zinc-800">{levelName}</span>
      </div>
    </div>
  );

  if (isFinished) {
    return (
       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 bg-black">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
             <span className="text-4xl">🏆</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Practice Complete!</h2>
        <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
            You scored <span className="text-emerald-400 font-bold">{score}</span> out of {data.length}.
        </p>
        
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold tracking-wider uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Try Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold tracking-wider uppercase hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col bg-black">
      <GameHeader />
      
      <div className="max-w-md mx-auto w-full px-6 pb-6 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-zinc-500 text-xs tracking-widest uppercase">Question {currentIndex + 1}/{data.length}</span>
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Score: {score}
            </div>
        </div>

        {/* Question Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 mb-6 flex-1 flex flex-col justify-center items-center">
            
            <div className="text-2xl sm:text-3xl font-bold text-white leading-relaxed flex flex-wrap gap-x-2 gap-y-4 justify-center items-center text-center">
            {gameState.parts.map((word, idx) => {
                if (idx === gameState.hiddenWordIndex) {
                const punctuation = word.replace(/[a-zA-Z]/g, ''); 
                return (
                    <div key={idx} className="flex items-baseline">
                    <div className="relative mx-1">
                        <form onSubmit={handleSubmit}>
                        <input
                        ref={inputRef}
                        type="text"
                        value={gameState.userAnswer}
                        onChange={(e) => !gameState.isSubmitted && setGameState({...gameState, userAnswer: e.target.value})}
                        disabled={gameState.isSubmitted}
                        className={`
                            min-w-[100px] w-[140px] text-center border-b-2 bg-transparent px-2 py-1 outline-none transition-all font-sans font-bold
                            ${gameState.isSubmitted 
                            ? gameState.isCorrect 
                                ? 'border-emerald-500 text-emerald-500' 
                                : 'border-rose-500 text-rose-500'
                            : 'border-indigo-500 text-indigo-400 focus:border-indigo-300'
                            }
                        `}
                        placeholder="_____"
                        autoComplete="off"
                        />
                        </form>
                    </div>
                    <span>{punctuation}</span>
                    </div>
                );
                }
                return <span key={idx} className="text-zinc-200">{word}</span>;
            })}
            </div>

            {/* Translation Hint */}
            <div className="mt-8 p-4 bg-black/20 rounded-xl text-center w-full">
            <p className="text-zinc-500 italic text-sm font-medium">"{data[currentIndex].translation}"</p>
            </div>

            {/* Feedback */}
            {gameState.isSubmitted && (
            <div className={`mt-6 flex items-center gap-2 ${gameState.isCorrect ? 'text-emerald-500' : 'text-rose-500'} font-bold animate-in fade-in`}>
                {gameState.isCorrect ? <Check size={20} /> : <X size={20} />}
                <span>{gameState.isCorrect ? 'Correct!' : `Answer: ${gameState.hiddenWord}`}</span>
            </div>
            )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
            {!gameState.isSubmitted ? (
            <button 
                onClick={handleSubmit}
                disabled={!gameState.userAnswer}
                className="w-full py-4 bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-indigo-500 text-white rounded-2xl font-bold tracking-wider uppercase transition-all"
            >
                Check Answer
            </button>
            ) : (
            <button 
                onClick={handleNext}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
                Next <ArrowRight size={20} />
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default FillBlankMode;