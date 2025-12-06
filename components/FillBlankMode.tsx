import React, { useState, useEffect, useRef } from 'react';
import { Sentence } from '../types';
import { RefreshCcw, Check, X, ArrowRight } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto px-6 py-4 flex justify-between items-center">
      <button 
        onClick={onExit}
        className="text-blue-600 font-bold text-sm tracking-wider hover:opacity-70 transition-opacity uppercase"
      >
        Quit
      </button>
      <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Quiz</span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1">{levelName}</span>
      </div>
    </div>
  );

  if (isFinished) {
    return (
       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 bg-white">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
             <span className="text-4xl">🏆</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Complete!</h2>
        <p className="text-slate-600 mb-8 max-w-xs mx-auto">
            You scored <span className="text-blue-600 font-bold">{score}</span> out of {data.length}. Keep up the great work!
        </p>
        
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold tracking-wider uppercase shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Try Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 bg-white text-slate-400 font-bold tracking-wider uppercase hover:text-slate-600 transition-colors"
          >
            Back to Modes
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <GameHeader />
      
      <div className="max-w-md mx-auto w-full px-6 pb-6 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-slate-300 text-xs tracking-widest uppercase">Question {currentIndex + 1}/{data.length}</span>
            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Score: {score}
            </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 flex-1 flex flex-col justify-center items-center">
            
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-relaxed flex flex-wrap gap-x-2 gap-y-4 justify-center items-center text-center">
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
                                ? 'border-green-400 text-green-600' 
                                : 'border-red-400 text-red-500'
                            : 'border-blue-300 text-blue-600 focus:border-blue-500'
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
                return <span key={idx} className="text-slate-700">{word}</span>;
            })}
            </div>

            {/* Translation Hint */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center w-full">
            <p className="text-slate-400 italic text-sm font-medium">"{data[currentIndex].translation}"</p>
            </div>

            {/* Feedback */}
            {gameState.isSubmitted && (
            <div className={`mt-6 flex items-center gap-2 ${gameState.isCorrect ? 'text-green-500' : 'text-red-500'} font-bold animate-in fade-in`}>
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
                className="w-full py-4 bg-blue-600 disabled:bg-slate-200 disabled:shadow-none hover:bg-blue-700 text-white rounded-2xl font-bold tracking-wider uppercase shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
                Check Answer
            </button>
            ) : (
            <button 
                onClick={handleNext}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold tracking-wider uppercase shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
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