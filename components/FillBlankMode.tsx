import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sentence } from '../types';
import { Check, X, ArrowRight } from 'lucide-react';
import GameHeader from './shared/GameHeader';
import CompletionScreen, { IncorrectItem } from './shared/CompletionScreen';
import LoadingLottie from './shared/LoadingLottie';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface FillBlankModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
  onNextGame: () => void;
  onAnotherLevel?: () => void;
}

interface QuestionState {
  parts: string[];
  hiddenWordIndex: number;
  hiddenWord: string;
  userAnswer: string;
  isCorrect: boolean | null;
  isSubmitted: boolean;
  sentence: string;
  vietnamese: string;
}

const FillBlankMode: React.FC<FillBlankModeProps> = ({ data, levelName, onExit, onNextGame, onAnotherLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<QuestionState | null>(null);
  const [score, setScore] = useState(0);
  const [incorrectItems, setIncorrectItems] = useState<IncorrectItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prepareQuestion = (sentence: Sentence): QuestionState => {
    return {
      parts: sentence.english.split(' '),
      hiddenWordIndex: -1, // No word hidden in English sentence
      hiddenWord: sentence.translation,
      userAnswer: '',
      isCorrect: null,
      isSubmitted: false,
      sentence: sentence.english,
      vietnamese: sentence.vietnamese || '',
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gameState || gameState.isSubmitted) return;
    const isCorrect = gameState.userAnswer.toLowerCase().trim() === gameState.hiddenWord.toLowerCase();
    setGameState(prev => prev ? { ...prev, isCorrect, isSubmitted: true } : null);
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setIncorrectItems(prev => [
        ...prev,
        {
          prompt: gameState.sentence,
          correctAnswer: gameState.hiddenWord,
        },
      ]);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleRestart = () => {
    setScore(0);
    setIncorrectItems([]);
    setCurrentIndex(0);
    setIsFinished(false);
  };

  // Keyboard navigation for 'Next'
  useKeyboardNavigation({
    onNext: handleNext,
    disabled: !gameState?.isSubmitted,
    isFinished,
    onNextGame,
  });

  if (isFinished) {
    return (
      <CompletionScreen
        totalQuestions={data.length}
        score={score}
        onRestart={handleRestart}
        onExit={onExit}
        onNextGame={onNextGame}
        onAnotherLevel={onAnotherLevel}
        mode="quiz"
        incorrectItems={incorrectItems}
      />
    );
  }

  if (!gameState) return <LoadingLottie />;

  return (
    <div className="flex-1 flex flex-col bg-black min-h-dvh">
      <GameHeader onExit={onExit} levelName={levelName} />
      
      <div className="max-w-md mx-auto w-full px-6 pb-6 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-zinc-500 text-xs tracking-widest uppercase">Question {currentIndex + 1}/{data.length}</span>
            
        </div>

        {/* Question Card */}
        <div className="bg-blue-500 border border-blue-800 rounded-[2rem] p-8 mb-6 flex-1 flex flex-col justify-center items-center">
            
            {/* English Sentence */}
            <div className="text-2xl sm:text-3xl font-bold text-white leading-relaxed text-center mb-8">
              {gameState.sentence.toLowerCase().replace(
                gameState.hiddenWord.toLowerCase(), 
                gameState.hiddenWord.replace(/[^ ]/g, '_')
              )}
            </div>

            {/* Input */}
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={gameState.userAnswer}
                  onChange={(e) => !gameState.isSubmitted && setGameState({...gameState, userAnswer: e.target.value})}
                  disabled={gameState.isSubmitted}
                  autoFocus
                  className={`
                  w-full border-b-2 border-lime-400 text-center text-xl border-b-2 bg-transparent px-4 py-3 outline-none transition-all font-medium placeholder-blue-300
                  ${gameState.isSubmitted 
                    ? gameState.isCorrect 
                    ? 'border-mist-500 text-mist-500' 
                    : 'border-rose-500 text-rose-500'
                    : 'border-blue-500 text-white focus:border-blue-300'
                  }
                  `}
                  placeholder={gameState.vietnamese}
                  autoComplete="off"
                />
                </form>
            </div>

            {/* Feedback */}
            {gameState.isSubmitted && (
            <div className={`mt-6 flex items-center gap-2 ${gameState.isCorrect ? 'text-white' : 'text-white'} text-xl font-bold animate-in fade-in`}>
                {gameState.isCorrect ? <Check size={20} /> : <X size={20} />}
                <span>{gameState.isCorrect ? 'Correct!' : `Answer: ${gameState.hiddenWord}`}</span>
            </div>
            )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
            {!gameState.isSubmitted ? (
            <button 
                onClick={() => handleSubmit()}
                disabled={!gameState.userAnswer}
                className="w-full py-4 bg-blue-600 disabled:bg-zinc-800 disabled:text-gray-600 hover:bg-blue-500 text-white rounded-2xl font-bold tracking-wider uppercase transition-all"
            >
                Check Answer
            </button>
            ) : (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-white text-black hover:bg-blue-200 rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              title="Next (Right Arrow / Enter)"
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