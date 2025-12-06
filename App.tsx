import React, { useState } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import { Layers, PenTool, ChevronLeft, Star, Zap, Crown, User } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="bg-white p-3 rounded-xl shadow-sm text-slate-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden border-2 border-white shadow-sm">
           <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
             <User size={20} />
           </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-slate-500 font-bold mb-1">Hey Learner!</p>
        <h2 className="text-2xl font-extrabold text-slate-900">Lets go to next level</h2>
      </div>

      {/* Levels List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Select your level</h3>
        <div className="grid gap-5">
          {LEVELS.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level)}
              className="group relative overflow-hidden w-full bg-[#5D3FD3] text-left p-0 rounded-[2rem] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {/* Card Background Gradient & shapes */}
              <div className={`absolute inset-0 bg-gradient-to-r ${idx === 0 ? 'from-indigo-500 to-purple-600' : idx === 1 ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-cyan-600'} opacity-90`}></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              
              <div className="relative p-6 flex items-center justify-between z-10">
                 <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between mb-8">
                       {/* Illustration placeholder */}
                       <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shadow-inner">
                          {idx === 0 && <Star className="text-yellow-300 fill-yellow-300 drop-shadow-md" size={32} />}
                          {idx === 1 && <Zap className="text-cyan-300 fill-cyan-300 drop-shadow-md" size={32} />}
                          {idx === 2 && <Crown className="text-orange-300 fill-orange-300 drop-shadow-md" size={32} />}
                       </div>
                       
                       <div className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                          <ChevronLeft className="text-white rotate-180" size={20} />
                       </div>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-1">{level.name.split(' ')[0]}</h4>
                    <p className="text-indigo-100 text-xs mb-3 font-medium opacity-80">{level.description}</p>
                    
                    {/* Progress Bar Fake */}
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-white/80">0/{level.sentences.length} words</span>
                       <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 w-1/4 rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Mode Selection View ---
  const renderModeSelection = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col relative animate-in slide-in-from-right-8 fade-in duration-500">
       {/* Custom Nav Header */}
       <div className="px-6 py-6 flex items-center gap-4">
          <button 
            onClick={handleBackToLevels}
            className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          >
             <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">Choose Mode</h2>
       </div>

       <div className="flex-1 px-6 pb-10 flex flex-col justify-center">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
               {selectedLevel?.name}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
               How do you want<br/>to learn today?
            </h1>
          </div>

          <div className="grid gap-6">
             {/* Flashcards Option */}
             <button
               onClick={() => handleModeSelect('flashcards')}
               className="group bg-white p-6 rounded-[2rem] shadow-sm border-2 border-transparent hover:border-yellow-400 transition-all text-left flex items-center gap-6 relative overflow-hidden"
             >
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 shrink-0 group-hover:scale-110 transition-transform">
                   <Layers size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Flashcards</h3>
                   <p className="text-slate-500 text-sm mt-1">Flip & learn at your pace</p>
                </div>
                <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronLeft className="rotate-180 text-yellow-400" />
                </div>
             </button>

             {/* Fill Blank Option */}
             <button
               onClick={() => handleModeSelect('fill-blank')}
               className="group bg-white p-6 rounded-[2rem] shadow-sm border-2 border-transparent hover:border-purple-400 transition-all text-left flex items-center gap-6 relative overflow-hidden"
             >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                   <PenTool size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Quiz Mode</h3>
                   <p className="text-slate-500 text-sm mt-1">Complete the sentences</p>
                </div>
                 <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronLeft className="rotate-180 text-purple-400" />
                </div>
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
    <div className="font-sans selection:bg-yellow-200">
      {view === 'levels' && renderLevelSelection()}
      {view === 'modes' && renderModeSelection()}
      {view === 'game' && renderGame()}
    </div>
  );
}

export default App;