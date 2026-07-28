import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onNext?: () => void;
  onPrev?: () => void;
  onFlip?: () => void;
  onNextGame?: () => void;
  disabled?: boolean;
  enableNext?: boolean;
  enablePrev?: boolean;
  isFinished?: boolean;
}

/**
 * Custom hook for keyboard navigation
 */
export const useKeyboardNavigation = ({
  onNext,
  onPrev,
  onFlip,
  onNextGame,
  disabled = false,
  enableNext = true,
  enablePrev = true,
  isFinished = false,
}: KeyboardNavigationOptions) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      
      if (e.key === 'ArrowLeft' && enablePrev && onPrev) {
        onPrev();
      } else if (e.key === 'Enter' && isFinished && onNextGame) {
        onNextGame();
      } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && enableNext && onNext) {
        onNext();
      } else if ((e.key === ' ' || e.key === 'Enter') && onFlip) {
        e.preventDefault();
        onFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onFlip, disabled, enableNext, enablePrev, isFinished, onNextGame]);
};
