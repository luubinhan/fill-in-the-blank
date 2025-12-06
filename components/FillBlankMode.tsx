import React, { useState, useEffect, useRef } from 'react';
import { Sentence } from '../types';
import { RefreshCcw, Check, X, ArrowRight, Home } from 'lucide-react';

interface FillBlankModeProps {
  data: Sentence[];
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

const FillBlankMode: React.FC<FillBlankModeProps> = ({ data, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<QuestionState | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize a question
  const prepareQuestion = (sentence: Sentence): QuestionState => {
    const words = sentence.english.split(' ');
    // Filter words that are long enough to be interesting (length > 2) unless the sentence is very short
    const candidates = words.map((w, i) => ({ w, i })).filter(item => item.w.replace(/[^a-zA-Z]/g, '').length > 1);
    
    // Fallback if no long words
    const target = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : { w: words[0], i: 0 };
    
    // Clean punctuation for answer checking
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
      // Focus input after a small delay to allow render
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

  if (isFinished) {
    return (
       <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in zoom-in duration-300">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Complete!</h2>
        <p className="text-slate-600 mb-8 text-lg">You got <span className="text-blue-600 font-bold">{score}</span> out of <span className="font-bold">{data.length}</span> correct.</p>
        
        <div className="flex flex-col w-full max-w-xs gap-3">
          <button 
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl font-bold text-lg shadow-[0_4px_0_rgb(202,138,4)] active:shadow-none active:translate-y-1 transition-all"
          >
            <RefreshCcw size={20} /> Try Again
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 rounded-xl font-bold text-lg border-2 border-slate-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col min-h-[500px] justify-between py-2">
      {/* Exit Button */}
      <div className="flex justify-start mb-2">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <Home size={18} /> Exit Lesson
        </button>
      </div>

      {/* Header Progress */}
      <div className="flex items-center justify-between mb-8">
        <span className="font-bold text-slate-400">Question {currentIndex + 1}/{data.length}</span>
        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
          Score: {score}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border-b-4 border-slate-100 mb-6 flex-1 flex flex-col justify-center">
        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6 text-center">Fill in the missing word</h3>
        
        <div className="text-2xl sm:text-3xl font-bold text-slate-700 leading-relaxed flex flex-wrap gap-2 justify-center items-center">
          {gameState.parts.map((word, idx) => {
            if (idx === gameState.hiddenWordIndex) {
              const punctuation = word.replace(/[a-zA-Z]/g, ''); // Extract punctuation
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
                        min-w-[80px] w-[140px] text-center border-b-4 bg-slate-50 px-2 py-1 outline-none transition-all rounded-t-md
                        ${gameState.isSubmitted 
                          ? gameState.isCorrect 
                            ? 'border-green-400 text-green-600 bg-green-50' 
                            : 'border-red-400 text-red-500 bg-red-50'
                          : 'border-blue-300 text-blue-600 focus:border-blue-500 focus:bg-blue-50'
                        }
                      `}
                      placeholder="?"
                    />
                    </form>
                    {/* Feedback Icon */}
                    {gameState.isSubmitted && (
                      <div className="absolute -right-6 top-2">
                        {gameState.isCorrect ? <Check size={20} className="text-green-500" /> : <X size={20} className="text-red-500" />}
                      </div>
                    )}
                  </div>
                  <span>{punctuation}</span>
                </div>
              );
            }
            return <span key={idx}>{word}</span>;
          })}
        </div>

        {/* Translation Hint */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-slate-500 italic">"{data[currentIndex].translation}"</p>
        </div>

        {/* Incorrect Answer Feedback */}
        {gameState.isSubmitted && !gameState.isCorrect && (
           <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-2">
            <span className="text-slate-400 text-sm">Correct answer:</span>
            <div className="text-red-500 font-bold text-xl">{gameState.hiddenWord}</div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pb-6">
        {!gameState.isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!gameState.userAnswer}
            className="w-full py-4 bg-blue-500 disabled:bg-slate-300 disabled:shadow-none hover:bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all"
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
          >
            Next Sentence <ArrowRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FillBlankMode;