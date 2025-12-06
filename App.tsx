import React, { useState } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import { Layers, PenTool, Star, Sparkles, ChevronLeft, Trophy, Crown, Zap } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('flashcards');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setView('levels');
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setView('game');
  };

  const handleExitGame = () => {
    setView('levels');
    setSelectedLevel(null);
  };

  const getLevelIcon = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return <Star className="w-6 h-6" />;
      case 'medium': return <Zap className="w-6 h-6" />;
      case 'hard': return <Crown className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const renderLevelSelection = () => (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => setView('menu')}
          className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          Select a Level
        </h2>
      </div>
      
      <div className="grid gap-4">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => handleLevelSelect(level)}
            className={`
              group relative overflow-hidden p-6 rounded-3xl shadow-md border-b-4 transition-all hover:scale-[1.02] hover:shadow-lg text-left w-full
              ${level.color} ${level.accentColor} border-opacity-50
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 bg-white/50 rounded-lg">{getLevelIcon(level.difficulty)}</span>
                  <h3 className="text-xl font-bold">{level.name}</h3>
                </div>
                <p className="opacity-80 font-medium mb-3">{level.description}</p>
                <div className="inline-flex items-center gap-1 text-sm font-bold bg-white/40 px-3 py-1 rounded-full">
                  <Trophy size={14} />
                  {level.sentences.length} Sentences
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-sm">
                <ChevronLeft size={24} className="rotate-180" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    if (!selectedLevel) return null;

    if (gameMode === 'flashcards') {
      return (
        <FlashcardMode 
          data={selectedLevel.sentences} 
          levelName={selectedLevel.name}
          onExit={handleExitGame} 
        />
      );
    }
    
    return (
      <FillBlankMode 
        data={selectedLevel.sentences} 
        levelName={selectedLevel.name}
        onExit={handleExitGame} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-yellow-200 flex flex-col">
      <header className="px-6 py-6 w-full max-w-4xl mx-auto flex items-center justify-center relative">
        <h1 
            className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight cursor-pointer flex items-center gap-2 hover:text-blue-600 transition-colors"
            onClick={() => setView('menu')}
        >
            <Sparkles className="text-yellow-400 w-8 h-8 fill-current" />
            Sentency
        </h1>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col">
        {view === 'menu' && (
          <div className="grid gap-6 max-w-md w-full mx-auto self-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-slate-100 text-center mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-yellow-500 w-10 h-10 fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, Learner!</h2>
                <p className="text-slate-500">Choose a game mode to start practicing.</p>
             </div>

            <button 
              onClick={() => handleModeSelect('flashcards')}
              className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-blue-400 transition-all text-left flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Flashcards</h3>
                <p className="text-slate-400 text-sm mt-1">Flip & Swipe to learn</p>
              </div>
            </button>

            <button 
              onClick={() => handleModeSelect('fill-blank')}
              className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-green-400 transition-all text-left flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">Fill in the Blank</h3>
                <p className="text-slate-400 text-sm mt-1">Complete the sentences</p>
              </div>
            </button>
          </div>
        )}

        {view === 'levels' && renderLevelSelection()}
        
        {view === 'game' && renderGame()}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>Keep practicing every day! 🌟</p>
      </footer>
    </div>
  );
}

export default App;