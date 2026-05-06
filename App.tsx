import React, { useState, useMemo } from 'react';
import { LEVELS } from './constants';
import { GameMode, ViewState, Level } from './types';
import FlashcardMode from './components/FlashcardMode';
import SpeakingFlashcardMode from './components/SpeakingFlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import VocabularyMode from './components/VocabularyMode';
import SpeakingView from './components/SpeakingView';
import ScreenHeader from './components/ScreenHeader';
import { Layers, PenTool} from 'lucide-react';
import { prepareGameData } from './utils/dataUtils';

import { SPEAKING_LEVELS } from './data/speaking-tourism';

const ALL_LEVELS = [...LEVELS, ...SPEAKING_LEVELS];

function getInitialStateFromURL(): {
  view: ViewState;
  gameMode: GameMode;
  selectedLevel: Level | null;
  sourceView: 'levels' | 'speaking';
} {
  const pathname = window.location.pathname;
  const isSpeakingPath = pathname.endsWith('/speaking') || pathname.endsWith('/speaking/');

  const params = new URLSearchParams(window.location.search);
  const levelParam = params.get('level');
  const modeParam = params.get('mode');

  if (!levelParam || !modeParam) {
    return { view: isSpeakingPath ? 'speaking' : 'levels', gameMode: 'flashcards', selectedLevel: null, sourceView: isSpeakingPath ? 'speaking' : 'levels' };
  }

  const validModes: GameMode[] = ['flashcards', 'fill-blank'];
  const mode = validModes.includes(modeParam as GameMode) ? (modeParam as GameMode) : null;
  if (!mode) {
    return { view: 'levels', gameMode: 'flashcards', selectedLevel: null, sourceView: 'levels' };
  }

  const decodedLevelName = decodeURIComponent(levelParam).trim();
  const level = ALL_LEVELS.find(
    (l) => l.name.trim().toLowerCase() === decodedLevelName.toLowerCase()
  );
  if (!level) {
    return { view: 'levels', gameMode: 'flashcards', selectedLevel: null, sourceView: 'levels' };
  }

  const source = isSpeakingPath ? 'speaking' : 'levels';
  return { view: 'game', gameMode: mode, selectedLevel: level, sourceView: source };
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
  const [sourceView, setSourceView] = useState<'levels' | 'speaking'>(initialState.sourceView);

  const handleLevelAndModeSelect = (level: Level, mode: GameMode, source: 'levels' | 'speaking' = 'levels') => {
    setSelectedLevel(level);
    setGameMode(mode);
    setGameKey(0);
    setSourceView(source);
    setView('game');
    const search = new URLSearchParams({
      level: level.name,
      difficulty: level.difficulty,
      mode,
    }).toString();
    const basePath = source === 'speaking'
      ? window.location.pathname.replace(/\/?$/, '').replace(/\/speaking\/?$/, '') + '/speaking'
      : window.location.pathname.replace(/\/speaking\/?$/, '');
    window.history.replaceState(null, '', `${basePath}?${search}`);
  };

  const handleExitGame = () => {
    setSelectedLevel(null);
    setView(sourceView);
    const basePath = window.location.pathname.replace(/\?.*$/, '');
    if (sourceView === 'speaking') {
      const speakingPath = basePath.endsWith('/speaking') ? basePath : basePath.replace(/\/?$/, '') + '/speaking';
      window.history.replaceState(null, '', speakingPath);
    } else {
      const levelsPath = basePath.replace(/\/speaking\/?$/, '') || '/';
      window.history.replaceState(null, '', levelsPath);
    }
  };

  const handleNextGame = () => {
    // Same game mode, same level, just shuffle to get different sentences
    setGameKey(prev => prev + 1);
  };

  const handleAnotherLevelSameMode = () => {
    if (!selectedLevel) return;
    const pool = sourceView === 'speaking' ? SPEAKING_LEVELS : LEVELS;
    const others = pool.filter((l) => l.name !== selectedLevel.name);
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

  const homeClick = () => {
    setView('levels');
    const levelsPath = window.location.pathname.replace(/\/speaking\/?$/, '') || '/';
    window.history.replaceState(null, '', levelsPath);
  }
  const speakingClick = () => {
    setView('speaking');
    const speakingPath = window.location.pathname.replace(/\/?$/, '') + '/speaking';
    window.history.replaceState(null, '', speakingPath);
  }

  // --- Level Selection View ---
  const renderLevelSelection = () => (
    <div className="min-h-screen max-w-7xl bg-black flex flex-col p-6 mx-auto w-full">
      <ScreenHeader
        onHomeClick={homeClick}
        onSpeakingClick={speakingClick}
        view={view}
      />

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

    const gameData = sourceView === 'speaking'
      ? selectedLevel.sentences
      : prepareGameData(selectedLevel.sentences);

    if (gameMode === 'flashcards') {
      if (sourceView === 'speaking') {
        return (
          <SpeakingFlashcardMode 
            key={gameKey}
            data={gameData} 
            levelName={selectedLevel.name}
            onExit={handleExitGame} 
            onNextGame={handleNextGame}
            onAnotherLevel={handleAnotherLevelSameMode}
          />
        );
      }

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

  const renderSpeakingView = () => (
    <div className="min-h-screen max-w-7xl bg-black flex flex-col p-6 mx-auto w-full">
      <ScreenHeader
        onHomeClick={homeClick}
        onSpeakingClick={speakingClick}
        view={view}
      />
      <SpeakingView
        onSelectLevel={(level, mode) => handleLevelAndModeSelect(level, mode, 'speaking')}
      />
    </div>
  );

  return (
    <div className="font-sans selection:bg-indigo-500/30">
      {view === 'levels' && renderLevelSelection()}
      {view === 'speaking' && renderSpeakingView()}
      {view === 'game' && renderGame()}
    </div>
  );
}

export default App;