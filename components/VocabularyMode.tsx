import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sentence } from '../types';
import { Check, X, ArrowRight } from 'lucide-react';
import GameHeader from './shared/GameHeader';
import CompletionScreen, { IncorrectItem } from './shared/CompletionScreen';
import LoadingLottie from './shared/LoadingLottie';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { getSelectableWords, stripPunctuation } from '../utils/dataUtils';

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
}

const FillBlankMode: React.FC<FillBlankModeProps> = ({ data, levelName, onExit, onNextGame, onAnotherLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<QuestionState | null>(null);
  const [score, setScore] = useState(0);
  const [incorrectItems, setIncorrectItems] = useState<IncorrectItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prepareQuestion = (sentence: Sentence): QuestionState => {
    const words = sentence.english.split(' ');
    const candidates = getSelectableWords(sentence.english);
    const target = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : { word: words[0], index: 0 };
    const cleanTargetWord = stripPunctuation(target.word);

    return {
      parts: words,
      hiddenWordIndex: target.index,
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
          prompt: data[currentIndex]?.translation || '',
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
      <GameHeader onExit={onExit} levelName={levelName} modeName="Quiz" />
      
      <div className="max-w-md mx-auto w-full px-6 pb-6 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-zinc-500 text-xs tracking-widest uppercase">Question {currentIndex + 1}/{data.length}</span>
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Score: {score}
            </div>
        </div>

        {/* Question Card */}
        <div className="bg-lime-600 border border-lime-500 rounded-[2rem] p-8 mb-6 flex-1 flex flex-col justify-between items-center">
          <div className="text-mist-500 px-2 py-1 text-center border border-lime-700 rounded-lg text-sm">{data[currentIndex]?.translation || ''}</div>
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
                        style={{ width: `${Math.max(10, gameState.hiddenWord.length - 2)}ch` }}
                        className={`
                            text-center border-b-2 border-lime-400 bg-transparent px-2 py-1 outline-none transition-all font-sans font-bold placeholder-lime-300
                            ${gameState.isSubmitted 
                            ? gameState.isCorrect 
                                ? 'border-mist-500 text-mist-500' 
                                : 'border-rose-500 text-rose-500'
                            : 'border-lime-600 text-white focus:border-lime-200'
                            }
                        `}
                        autoComplete="off"
                        /* placeholder={data[currentIndex]?.translation || ''} */
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
           
            
            {/* Feedback */}
            
            <div className={`mt-6 flex items-center gap-2 ${gameState.isCorrect ? 'text-white' : 'text-white'} text-xl font-bold animate-in fade-in`}>
            {gameState.isSubmitted ? (
              <>
                {gameState.isCorrect ? <Check size={20} /> : <X size={20} />}
                <span>{gameState.isCorrect ? 'Correct!' : `Answer: ${gameState.hiddenWord}`}</span>
              </>
            ) : <> </>}
            </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
            {!gameState.isSubmitted ? (
            <button 
                onClick={() => handleSubmit()}
                disabled={!gameState.userAnswer}
                className="w-full py-4 bg-lime-800 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-lime-600 text-white rounded-2xl font-bold tracking-wider uppercase transition-all"
            >
                Check Answer
            </button>
            ) : (
            <button 
                onClick={handleNext}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                title="Next (Right Arrow)"
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