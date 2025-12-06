import React, { useState } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import { Layers, PenTool, ChevronLeft, Star, Zap, Crown, User, RotateCw, Clock, Flame, LayoutGrid } from 'lucide-react';

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

  // --- Level Selection View ---
  const renderLevelSelection = () => (
    <div className="min-h-screen bg-black flex flex-col p-6 animate-in fade-in duration-500 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 pt-4">
        <span className="text-zinc-400 font-bold text-sm tracking-wider uppercase">Sentency.io</span>
        <button className="text-zinc-400 hover:text-white transition-colors" onClick={handleBackToLevels}>
          <LayoutGrid size={24} />
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white leading-tight mb-2">What is your goal<br/>for this session?</h2>
        <p className="text-zinc-500 font-medium">Select a difficulty level to start.</p>
      </div>

      {/* Levels List - Styled as Goals */}
      <div className="flex-1 flex flex-col gap-4">
          {LEVELS.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level)}
              className="group w-full bg-zinc-900 border border-zinc-800 active:border-zinc-600 hover:bg-zinc-800 text-left p-6 rounded-2xl transition-all flex items-center justify-between"
            >
              <div className="flex flex-col">
                  <span className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                    {level.name}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                     {level.sentences.length} Cards • {level.difficulty}
                  </span>
              </div>
              <div className="text-2xl">
                 {idx === 0 && '👀'}
                 {idx === 1 && '⏰'}
                 {idx === 2 && '🔥'}
              </div>
            </button>
          ))}
          
          <button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-left p-6 rounded-2xl transition-all flex items-center justify-between opacity-50 cursor-not-allowed">
              <span className="text-lg font-bold text-zinc-400">Freeplay</span>
              <span className="text-2xl">😎</span>
          </button>
      </div>
    </div>
  );

  // --- Mode Selection View ---
  const renderModeSelection = () => (
    <div className="min-h-screen bg-black flex flex-col relative animate-in slide-in-from-right-8 fade-in duration-500 max-w-md mx-auto w-full p-6">
       {/* Custom Nav Header */}
       <div className="flex items-center justify-between mb-8 pt-4">
          <button 
            onClick={handleBackToLevels}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
             <ChevronLeft size={20} /> <span className="text-sm font-bold uppercase tracking-wider">Back</span>
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors" onClick={handleBackToLevels}>
            <LayoutGrid size={24} />
          </button>
       </div>

       <div className="mb-6">
           <div className="bg-indigo-600 rounded-2xl p-6 text-center mb-8 shadow-lg shadow-indigo-900/20">
               <h3 className="text-2xl font-bold text-white mb-2">Awesome choice!</h3>
               <p className="text-indigo-200 text-sm font-medium">You selected <span className="text-white font-bold">{selectedLevel?.name}</span>.</p>
               
               <div className="flex justify-center gap-8 mt-6">
                   <div className="text-center">
                       <span className="block text-2xl font-bold text-white">{selectedLevel?.sentences.length}</span>
                       <span className="text-[10px] text-indigo-300 uppercase tracking-wider">Cards</span>
                   </div>
                   <div className="text-center">
                       <span className="block text-2xl font-bold text-white">0</span>
                       <span className="text-[10px] text-indigo-300 uppercase tracking-wider">Seen</span>
                   </div>
                   <div className="text-center">
                       <span className="block text-2xl font-bold text-white">~5</span>
                       <span className="text-[10px] text-indigo-300 uppercase tracking-wider">Mins</span>
                   </div>
               </div>
           </div>

           <h2 className="text-xl font-bold text-white mb-4">Choose how to study</h2>

           <div className="grid gap-4">
             {/* Flashcards Option */}
             <button
               onClick={() => handleModeSelect('flashcards')}
               className="group bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:bg-zinc-800 transition-all text-left flex items-center gap-4"
             >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                   <Layers size={24} />
                </div>
                <div className="flex-1">
                   <h3 className="text-lg font-bold text-white">Flashcards</h3>
                   <p className="text-zinc-500 text-xs mt-1">Flip & learn at your pace</p>
                </div>
                <ChevronLeft className="rotate-180 text-zinc-700 group-hover:text-white transition-colors" size={20} />
             </button>

             {/* Fill Blank Option */}
             <button
               onClick={() => handleModeSelect('fill-blank')}
               className="group bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:bg-zinc-800 transition-all text-left flex items-center gap-4"
             >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                   <PenTool size={24} />
                </div>
                <div className="flex-1">
                   <h3 className="text-lg font-bold text-white">Quiz Mode</h3>
                   <p className="text-zinc-500 text-xs mt-1">Complete the sentences</p>
                </div>
                <ChevronLeft className="rotate-180 text-zinc-700 group-hover:text-white transition-colors" size={20} />
             </button>
           </div>
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
    <div className="font-sans selection:bg-indigo-500/30">
      {view === 'levels' && renderLevelSelection()}
      {view === 'modes' && renderModeSelection()}
      {view === 'game' && renderGame()}
    </div>
  );
}

export default App;