import React, { useState } from 'react';
import { SAMPLE_SENTENCES } from './constants';
import { GameMode } from './types';
import FlashcardMode from './components/FlashcardMode';
import FillBlankMode from './components/FillBlankMode';
import { Layers, PenTool, Star, Sparkles } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<GameMode>('menu');

  const renderContent = () => {
    switch (mode) {
      case 'flashcards':
        return <FlashcardMode data={SAMPLE_SENTENCES} onExit={() => setMode('menu')} />;
      case 'fill-blank':
        return <FillBlankMode data={SAMPLE_SENTENCES} onExit={() => setMode('menu')} />;
      default:
        return (
          <div className="grid gap-6 max-w-md w-full mx-auto self-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-slate-100 text-center mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-yellow-500 w-10 h-10 fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, Learner!</h2>
                <p className="text-slate-500">Ready to practice your English sentences today?</p>
             </div>

            <button 
              onClick={() => setMode('flashcards')}
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
              onClick={() => setMode('fill-blank')}
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-yellow-200 flex flex-col">
      <header className="px-6 py-6 w-full max-w-4xl mx-auto flex items-center justify-center relative">
        <h1 
            className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight cursor-pointer flex items-center gap-2 hover:text-blue-600 transition-colors"
            onClick={() => setMode('menu')}
        >
            <Sparkles className="text-yellow-400 w-8 h-8 fill-current" />
            Sentency
        </h1>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col">
        {renderContent()}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>Keep practicing every day! 🌟</p>
      </footer>
    </div>
  );
}

export default App;