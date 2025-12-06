import React, { useState } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import { Layers, PenTool, ChevronLeft, Star, Zap, Crown } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>('levels');
  const [gameMode, setGameMode] = useState<GameMode>('flashcards');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setView('modes');
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setView('game');
  };

  const handleExitGame = () => {
    setView('modes');
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setView('levels');
  };

  const getLevelIcon = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return <Star className="w-5 h-5" />;
      case 'medium': return <Zap className="w-5 h-5" />;
      case 'hard': return <Crown className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  // Modern "Skip" style button for navigation
  const NavHeader = ({ onClick, label }: { onClick: () => void, label?: string }) => (
    <div className="w-full max-w-4xl mx-auto px-6 pt-6 pb-2 flex justify-between items-center">
      <button 
        onClick={onClick}
        className="text-blue-600 font-bold text-sm tracking-wider hover:opacity-70 transition-opacity uppercase"
      >
        {label || "Back"}
      </button>
      <div className="text-xs font-bold text-slate-300 tracking-widest uppercase">Sentency</div>
    </div>
  );

  const renderLevelSelection = () => (
    <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-6 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10 text-center">
                <h1 className="text-4xl text-slate-800 font-bold mb-4 leading-tight">
                Select your level
                </h1>
                <p className="text-slate-500 leading-relaxed">
                Choose a difficulty level to start your English learning journey.
                </p>
            </div>
            
            <div className="space-y-4">
                {LEVELS.map((level) => (
                <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level)}
                    className="w-full group bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all text-left flex items-center gap-4"
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${level.color.split(' ')[0]}`}>
                        <span className={level.color.split(' ')[1]}>{getLevelIcon(level.difficulty)}</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{level.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{level.sentences.length} sentences • {level.difficulty}</p>
                    </div>
                    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                        <ChevronLeft size={24} className="rotate-180" />
                    </div>
                </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderModeSelection = () => (
    <>
      <NavHeader onClick={handleBackToLevels} label="Change Level" />
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-6 animate-in slide-in-from-right-8 fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center pb-20">
            {/* Header Section */}
            <div className="mb-10">
                <span className="text-blue-500 font-bold tracking-wider uppercase text-xs mb-2 block">Level: {selectedLevel?.name}</span>
                <h2 className="text-3xl text-slate-800 font-bold mb-4 leading-tight">
                  How do you want to practice?
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  Select a game mode to test your skills.
                </p>
            </div>

            {/* Card Options */}
            <div className="grid gap-6">
                {/* Flashcards Card */}
                <div 
                onClick={() => handleModeSelect('flashcards')}
                className="group cursor-pointer bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden border border-slate-100"
                >
                    <div className="bg-indigo-50 h-28 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute w-24 h-24 bg-indigo-100 rounded-full -top-4 -right-4 opacity-50" />
                        <div className="absolute w-16 h-16 bg-indigo-100 rounded-full bottom-2 left-8 opacity-50" />
                        <Layers className="text-indigo-500 w-10 h-10 relative z-10" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Flashcards</h3>
                        <p className="text-slate-500 text-sm mb-4">Flip cards to learn new sentences and their meanings.</p>
                        <div className="w-full py-3 bg-indigo-50 text-indigo-600 font-bold text-center rounded-xl text-sm uppercase tracking-wide group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            Start Learning
                        </div>
                    </div>
                </div>

                {/* Fill Blank Card */}
                <div 
                onClick={() => handleModeSelect('fill-blank')}
                className="group cursor-pointer bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden border border-slate-100"
                >
                    <div className="bg-amber-50 h-28 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute w-32 h-32 bg-amber-100 rounded-full -bottom-10 -right-10 opacity-50" />
                        <PenTool className="text-amber-500 w-10 h-10 relative z-10" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Fill in the Blank</h3>
                        <p className="text-slate-500 text-sm mb-4">Test your knowledge by completing the missing words.</p>
                        <div className="w-full py-3 bg-amber-50 text-amber-600 font-bold text-center rounded-xl text-sm uppercase tracking-wide group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            Take Quiz
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
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
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 flex flex-col">
      {view === 'levels' && (
           <header className="px-6 py-6 flex justify-end">
               <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Sentency</span>
           </header>
      )}

      {view === 'levels' && renderLevelSelection()}
      {view === 'modes' && renderModeSelection()}
      {view === 'game' && (
          <div className="flex-1 flex flex-col">
              {renderGame()}
          </div>
      )}
    </div>
  );
}

export default App;