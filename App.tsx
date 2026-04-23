import React, { useState, useMemo } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import VocabularyMode from './components/VocabularyMode';
import { Layers, PenTool, LayoutGrid } from 'lucide-react';
import { prepareGameData } from './utils/dataUtils';

function getInitialStateFromURL(): {
  view: ViewState;
  gameMode: GameMode;
  selectedLevel: Level | null;
} {
  const params = new URLSearchParams(window.location.search);
  const levelParam = params.get('level');
  const modeParam = params.get('mode');

  if (!levelParam || !modeParam) {
    return { view: 'levels', gameMode: 'flashcards', selectedLevel: null };
  }

  const validModes: GameMode[] = ['flashcards', 'fill-blank'];
  const mode = validModes.includes(modeParam as GameMode) ? (modeParam as GameMode) : null;
  if (!mode) {
    return { view: 'levels', gameMode: 'flashcards', selectedLevel: null };
  }

  const decodedLevelName = decodeURIComponent(levelParam).trim();
  const level = LEVELS.find(
    (l) => l.name.trim().toLowerCase() === decodedLevelName.toLowerCase()
  );
  if (!level) {
    return { view: 'levels', gameMode: 'flashcards', selectedLevel: null };
  }

  return { view: 'game', gameMode: mode, selectedLevel: level };
}

function App() {
  const levelBadgePalette = [
    'bg-rose-500/15 text-rose-300',
    'bg-amber-500/15 text-amber-300',
    'bg-emerald-500/15 text-emerald-300',
    'bg-cyan-500/15 text-cyan-300',
    'bg-sky-500/15 text-sky-300',
    'bg-fuchsia-500/15 text-fuchsia-300',
    'bg-lime-500/15 text-lime-300',
  ];

  const initialState = useMemo(() => getInitialStateFromURL(), []);
  const randomLevelBadgeColors = useMemo(
    () => LEVELS.map(() => levelBadgePalette[Math.floor(Math.random() * levelBadgePalette.length)]),
    []
  );
  const [view, setView] = useState<ViewState>(initialState.view);
  const [gameMode, setGameMode] = useState<GameMode>(initialState.gameMode);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(initialState.selectedLevel);
  const [gameKey, setGameKey] = useState(0);

  const handleLevelAndModeSelect = (level: Level, mode: GameMode) => {
    setSelectedLevel(level);
    setGameMode(mode);
    setGameKey(0);
    setView('game');
    const search = new URLSearchParams({
      level: level.name,
      difficulty: level.difficulty,
      mode,
    }).toString();
    window.history.replaceState(null, '', `${window.location.pathname}?${search}`);
  };

  const handleExitGame = () => {
    setSelectedLevel(null);
    setView('levels');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleNextGame = () => {
    // Same game mode, same level, just shuffle to get different sentences
    setGameKey(prev => prev + 1);
  };

  const handleAnotherLevelSameMode = () => {
    if (!selectedLevel) return;
    const others = LEVELS.filter((l) => l.name !== selectedLevel.name);
    const level = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : selectedLevel;
    setSelectedLevel(level);
    setGameKey((prev) => prev + 1);
    const search = new URLSearchParams({
      level: level.name,
      difficulty: level.difficulty,
      mode: gameMode,
    }).toString();
    window.history.replaceState(null, '', `${window.location.pathname}?${search}`);
  };

  // --- Level Selection View ---
  const renderLevelSelection = () => (
    <div className="min-h-screen max-w-7xl bg-black flex flex-col p-6 mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 pt-4">
        <div className="text-zinc-400">
          <LayoutGrid size={24} />
        </div>
      </div>

      {/* Levels List - Styled as Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {LEVELS.map((level, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 text-left p-6 rounded-2xl transition-all"
            >
              <div className="flex items-center mb-4">
                 <div className={`text-2xl ${randomLevelBadgeColors[idx]} mr-4 font-bold rounded-full w-10 h-10 flex items-center justify-center`}>
                   {level.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white mb-1">
                      {level.name}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                       {level.sentences.length} Cards • {level.difficulty}
                    </span>
                </div>
              </div>
              
              {/* Mode Selection Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLevelAndModeSelect(level, 'flashcards')}
                  className="bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 p-4 rounded-xl transition-all flex flex-col items-center gap-2"
                >
                  <Layers size={20} className="text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-400">Flashcards</span>
                </button>
                
                <button
                  onClick={() => handleLevelAndModeSelect(level, 'fill-blank')}
                  className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 p-4 rounded-xl transition-all flex flex-col items-center gap-2"
                >
                  <PenTool size={20} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">Quiz Mode</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );



  const renderGame = () => {
    if (!selectedLevel) return null;

    const gameData = prepareGameData(selectedLevel.sentences);

    if (gameMode === 'flashcards') {
      return (
        <FlashcardMode 
          key={gameKey}
          data={gameData} 
          levelName={selectedLevel.name}
          onExit={handleExitGame} 
          onNextGame={handleNextGame}
          onAnotherLevel={handleAnotherLevelSameMode}
        />
      );
    }

    if (gameMode === 'fill-blank' && selectedLevel.difficulty === 'easy') {
      return (
        <VocabularyMode 
          key={gameKey}
          data={gameData} 
          levelName={selectedLevel.name}
          onExit={handleExitGame} 
          onNextGame={handleNextGame}
          onAnotherLevel={handleAnotherLevelSameMode}
        />
      )
    }
    
    return (
      <FillBlankMode 
        key={gameKey}
        data={gameData} 
        levelName={selectedLevel.name}
        onExit={handleExitGame}
        onNextGame={handleNextGame}
        onAnotherLevel={handleAnotherLevelSameMode}
      />
    );
  };

  return (
    <div className="font-sans selection:bg-indigo-500/30">
      {view === 'levels' && renderLevelSelection()}
      {view === 'game' && renderGame()}
    </div>
  );
}

export default App;