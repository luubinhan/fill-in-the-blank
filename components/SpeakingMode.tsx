import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Eye, Mic, X } from 'lucide-react';
import { Sentence } from '../types';
import GameHeader from './shared/GameHeader';
import CompletionScreen, { IncorrectItem } from './shared/CompletionScreen';
import LoadingLottie from './shared/LoadingLottie';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { hiddenPhraseMatches } from '../utils/speechMatch';

interface SpeakingModeProps {
  data: Sentence[];
  levelName: string;
  onExit: () => void;
  onNextGame: () => void;
  onAnotherLevel?: () => void;
}

interface HiddenRange {
  start: number;
  end: number;
}

interface QuestionState {
  sentence: string;
  hiddenWord: string;
  vietnamese: string;
  range: HiddenRange | null;
  transcript: string;
  isCorrect: boolean | null;
  isSubmitted: boolean;
  revealed: boolean;
}

interface RecognitionAlternative {
  transcript: string;
}

interface RecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: RecognitionAlternative;
}

interface RecognitionResultList {
  readonly length: number;
  [index: number]: RecognitionResult;
}

interface RecognitionEvent extends Event {
  readonly results: RecognitionResultList;
}

interface RecognitionErrorEvent extends Event {
  readonly error: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const host = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

function normalizeApostrophes(value: string): string {
  return value.replace(/[’‘]/g, "'");
}

function findHiddenRange(english: string, translation: string): HiddenRange | null {
  const needle = normalizeApostrophes(translation).toLowerCase();
  if (!needle) return null;
  const start = normalizeApostrophes(english).toLowerCase().indexOf(needle);
  if (start === -1) return null;
  return { start, end: start + needle.length };
}

function maskPhrase(phrase: string): string {
  return phrase.replace(/[^ ]/g, '_');
}

function prepareQuestion(sentence: Sentence): QuestionState {
  return {
    sentence: sentence.english,
    hiddenWord: sentence.translation,
    vietnamese: sentence.vietnamese ?? '',
    range: findHiddenRange(sentence.english, sentence.translation),
    transcript: '',
    isCorrect: null,
    isSubmitted: false,
    revealed: false,
  };
}

function recognitionErrorMessage(error: string): string {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'Microphone permission was denied.';
  }
  if (error === 'audio-capture') {
    return 'No microphone was found.';
  }
  if (error === 'no-speech') {
    return 'No speech detected. Try again.';
  }
  return 'Speech recognition failed. Try again.';
}

const SpeakingMode: React.FC<SpeakingModeProps> = ({ data, levelName, onExit, onNextGame, onAnotherLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<QuestionState | null>(null);
  const [score, setScore] = useState(0);
  const [incorrectItems, setIncorrectItems] = useState<IncorrectItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [speechSupported] = useState(() => getSpeechRecognitionConstructor() !== null);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const gameStateRef = useRef<QuestionState | null>(null);
  const shouldScoreRef = useRef(false);
  const intentionalStopRef = useRef(false);
  const phaseRef = useRef<'idle' | 'listening' | 'stopping'>('idle');
  const transcriptRef = useRef('');

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const releaseRecognition = useCallback((allowFinalResult: boolean) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (!allowFinalResult) {
      shouldScoreRef.current = false;
      intentionalStopRef.current = false;
      phaseRef.current = 'idle';
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognitionRef.current = null;
      try {
        recognition.abort();
      } catch {
        // Already stopped.
      }
      return;
    }
    try {
      recognition.stop();
    } catch {
      recognition.onend?.();
    }
  }, []);

  const scoreTranscript = useCallback((transcript: string) => {
    const current = gameStateRef.current;
    if (!current || current.isSubmitted) return;
    const isCorrect = hiddenPhraseMatches(transcript, current.hiddenWord);
    const next: QuestionState = {
      ...current,
      transcript,
      isCorrect,
      isSubmitted: true,
    };
    gameStateRef.current = next;
    setGameState(next);
    setIsListening(false);
    setLiveTranscript('');
    if (isCorrect) {
      setScore((value) => value + 1);
    } else {
      setIncorrectItems((items) => [
        ...items,
        { prompt: current.sentence, correctAnswer: current.hiddenWord },
      ]);
    }
  }, []);

  useEffect(() => {
    releaseRecognition(false);
    setIsListening(false);
    setLiveTranscript('');
    setMicError(null);
    transcriptRef.current = '';
    shouldScoreRef.current = false;
    intentionalStopRef.current = false;

    if (currentIndex < data.length) {
      const next = prepareQuestion(data[currentIndex]);
      gameStateRef.current = next;
      setGameState(next);
    } else {
      gameStateRef.current = null;
      setGameState(null);
      setIsFinished(true);
    }
  }, [currentIndex, data, releaseRecognition]);

  useEffect(() => () => releaseRecognition(false), [releaseRecognition]);

  const handleMicClick = () => {
    const current = gameStateRef.current;
    if (!speechSupported || !current || current.isSubmitted || phaseRef.current === 'stopping') return;

    if (phaseRef.current === 'listening' && recognitionRef.current) {
      intentionalStopRef.current = true;
      shouldScoreRef.current = true;
      phaseRef.current = 'stopping';
      releaseRecognition(true);
      return;
    }

    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) return;

    releaseRecognition(false);
    setMicError(null);
    setLiveTranscript('');
    transcriptRef.current = '';
    shouldScoreRef.current = false;
    intentionalStopRef.current = false;
    phaseRef.current = 'listening';

    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0]?.transcript ?? '';
      }
      transcriptRef.current = text.trim();
      setLiveTranscript(transcriptRef.current);
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted' || intentionalStopRef.current) return;
      shouldScoreRef.current = false;
      phaseRef.current = 'stopping';
      setIsListening(false);
      setMicError(recognitionErrorMessage(event.error));
    };

    recognition.onend = () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      const pendingScore = shouldScoreRef.current;
      shouldScoreRef.current = false;
      intentionalStopRef.current = false;
      phaseRef.current = 'idle';
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setIsListening(false);
      if (pendingScore) {
        scoreTranscript(transcriptRef.current);
      }
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      phaseRef.current = 'idle';
      recognitionRef.current = null;
      setIsListening(false);
      setMicError('Could not start the microphone. Try again.');
    }
  };

  const handleReveal = () => {
    setGameState((prev) => {
      if (!prev || prev.isSubmitted || prev.revealed) return prev;
      const next = { ...prev, revealed: true };
      gameStateRef.current = next;
      return next;
    });
  };

  const handleNext = useCallback(() => {
    releaseRecognition(false);
    setCurrentIndex((prev) => prev + 1);
  }, [releaseRecognition]);

  const handleRestart = () => {
    releaseRecognition(false);
    setScore(0);
    setIncorrectItems([]);
    setCurrentIndex(0);
    setIsFinished(false);
  };

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

  const showPhrase = gameState.revealed || gameState.isSubmitted;
  const before = gameState.range ? gameState.sentence.slice(0, gameState.range.start) : gameState.sentence;
  const phrase = gameState.range ? gameState.sentence.slice(gameState.range.start, gameState.range.end) : '';
  const after = gameState.range ? gameState.sentence.slice(gameState.range.end) : '';

  return (
    <div className="flex-1 flex flex-col bg-black min-h-dvh">
      <GameHeader onExit={onExit} levelName={levelName} modeName="Speaking" />

      <div className="max-w-md mx-auto w-full px-6 pb-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="font-bold text-zinc-500 text-xs tracking-widest uppercase">
            Question {currentIndex + 1}/{data.length}
          </span>
        </div>

        <div className="bg-blue-500 border border-blue-800 rounded-[2rem] p-8 mb-6 flex-1 flex flex-col justify-center items-center">
          <div className="text-2xl sm:text-3xl font-bold text-white leading-relaxed text-center mb-8">
            {gameState.range ? (
              <>
                {before.toLowerCase()}
                {showPhrase ? (
                  gameState.isSubmitted && gameState.isCorrect ? (
                    <span className="text-green-300">{phrase.toLowerCase()}</span>
                  ) : (
                    phrase.toLowerCase()
                  )
                ) : (
                  maskPhrase(phrase)
                )}
                {after.toLowerCase()}
              </>
            ) : (
              gameState.sentence.toLowerCase()
            )}
          </div>

          {gameState.vietnamese && (
            <p className="text-center bg-white/20 rounded-md px-2 py-1 text-blue-100 text-lg font-medium mb-8">{gameState.vietnamese}</p>
          )}

          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            {isListening && (
              <p className="text-center text-blue-100 text-base min-h-6">{liveTranscript}</p>
            )}

            {!speechSupported && (
              <p className="text-center text-sm text-blue-100">Speech recognition is not available in this browser.</p>
            )}

            {micError && !gameState.isSubmitted && (
              <p className="text-center text-sm text-rose-100">{micError}</p>
            )}

            {!gameState.revealed && !gameState.isSubmitted && gameState.range && (
              <button
                type="button"
                onClick={handleReveal}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all"
              >
                <Eye size={16} />
                Show words
              </button>
            )}

            {gameState.isSubmitted && (
              <div className="mt-2 flex flex-col items-center gap-2 text-white text-xl font-bold">
                <div className="flex items-center gap-2">
                  {gameState.isCorrect ? <Check size={20} /> : <X size={20} />}
                  <span>{gameState.isCorrect ? 'Correct' : 'Wrong'}</span>
                </div>
                {!gameState.isCorrect && (
                  <p className="text-base font-medium text-blue-100 text-center">{gameState.transcript}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto">
          {!gameState.isSubmitted ? (
            <button
              type="button"
              onClick={handleMicClick}
              disabled={!speechSupported}
              className="cursor-pointer w-full py-4 bg-blue-600 disabled:bg-zinc-800 disabled:text-gray-600 hover:bg-blue-500 text-white rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <Mic size={20} />
              {isListening ? 'Stop and score' : 'Start listening'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="cursor-pointer w-full py-4 bg-white text-black hover:bg-blue-200 rounded-2xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
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

export default SpeakingMode;
