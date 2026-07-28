# Incorrect Answers on Completion Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On quiz completion, show each missed question as prompt + correct answer under the score (FillBlank + Vocabulary only).

**Architecture:** Optional `incorrectItems` prop on shared `CompletionScreen`. Quiz modes accumulate `{ prompt, correctAnswer }` on wrong submit, clear on restart, pass the list when finished. Flashcard callers omit the prop.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind utility classes (existing project patterns).

## Global Constraints

- Commits land on branch `dev` (Option C: leave `main` alone; unrelated histories).
- Spec: `docs/superpowers/specs/2026-07-29-incorrect-answers-completion-design.md`
- No automated test harness in this repo; verify manually per task.
- Do not show the user’s typed wrong answer.
- Do not change Flashcard / SpeakingFlashcard completion copy or props beyond staying compatible with optional `incorrectItems`.
- Target app structure includes `components/shared/CompletionScreen.tsx` on `dev`.

## File Structure

| File | Responsibility |
|------|----------------|
| `components/shared/CompletionScreen.tsx` | Export `IncorrectItem`; accept `incorrectItems?`; render Missed list when non-empty |
| `components/FillBlankMode.tsx` | Track incorrect items; map english → prompt, translation → correctAnswer; pass prop; clear on restart |
| `components/VocabularyMode.tsx` | Track incorrect items; map translation hint → prompt, hidden word → correctAnswer; pass prop; clear on restart |

---

### Task 1: Confirm base codebase on `dev`

**Files:**
- Ensure present: `components/shared/CompletionScreen.tsx`, `components/FillBlankMode.tsx`, `components/VocabularyMode.tsx` (and their existing deps: `GameHeader`, `LoadingLottie`, `useKeyboardNavigation`, etc.)

**Interfaces:**
- Consumes: current `dev` tree that already uses `CompletionScreen`
- Produces: confirmed buildable base on `dev` so Tasks 2–4 apply cleanly

- [ ] **Step 1: Confirm branch and whether CompletionScreen exists**

```bash
git checkout dev
git status -sb
test -f components/shared/CompletionScreen.tsx && echo HAS_COMPLETION || echo MISSING_COMPLETION
```

Expected: on `dev` and `HAS_COMPLETION`. If missing, stop and escalate (do not merge unrelated `main`).

- [ ] **Step 2: Smoke-check app still builds**

```bash
npm run build
```

Expected: Vite build succeeds (exit 0).

- [ ] **Step 3: No commit required if only verification**

If docs/spec/plan need to land on `dev` from elsewhere, cherry-pick those commits; otherwise no commit.

---

### Task 2: `CompletionScreen` incorrect list UI

**Files:**
- Modify: `components/shared/CompletionScreen.tsx`

**Interfaces:**
- Consumes: existing `CompletionScreenProps` (`totalQuestions`, `score?`, `onRestart`, `onExit`, `onNextGame?`, `onAnotherLevel?`, `mode`)
- Produces:
  - `export type IncorrectItem = { prompt: string; correctAnswer: string }`
  - Prop `incorrectItems?: IncorrectItem[]`
  - When `mode === 'quiz'` and `incorrectItems?.length > 0`, render scrollable Missed list (prompt muted, correctAnswer emphasized)

- [ ] **Step 1: Add type + prop to the interface**

Replace the top of `components/shared/CompletionScreen.tsx` with:

```tsx
import React from 'react';
import { RefreshCcw, ArrowRight, Shuffle } from 'lucide-react';

export type IncorrectItem = {
  prompt: string;
  correctAnswer: string;
};

interface CompletionScreenProps {
  totalQuestions: number;
  score?: number;
  onRestart: () => void;
  onExit: () => void;
  onNextGame?: () => void;
  onAnotherLevel?: () => void;
  mode: 'flashcards' | 'quiz';
  incorrectItems?: IncorrectItem[];
}
```

- [ ] **Step 2: Destructure `incorrectItems` and render the list between score and buttons**

Update the component signature and the middle of the JSX (keep header/emoji/buttons the same). Replace the score `<p>` and the start of the buttons wrapper so the list sits between them:

```tsx
const CompletionScreen: React.FC<CompletionScreenProps> = ({
  totalQuestions,
  score,
  onRestart,
  onExit,
  onNextGame,
  onAnotherLevel,
  mode,
  incorrectItems = [],
}) => {
  const isQuizMode = mode === 'quiz';
  const emoji = isQuizMode ? '🏆' : '🎉';
  const bgColor = isQuizMode ? 'bg-emerald-500/20' : 'bg-indigo-500/20';
  const scoreColor = 'text-emerald-400';
  const showMissed = isQuizMode && incorrectItems.length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 bg-black min-h-dvh">
      <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
        <span className="text-4xl">{emoji}</span>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">
        {isQuizMode ? 'Practice Complete!' : 'Session Complete!'}
      </h2>

      <p className={`text-zinc-400 max-w-xs mx-auto ${showMissed ? 'mb-4' : 'mb-8'}`}>
        {isQuizMode ? (
          <>You scored <span className={`${scoreColor} font-bold`}>{score}</span> out of {totalQuestions}.</>
        ) : (
          <>You have reviewed all <strong className="text-indigo-400">{totalQuestions}</strong> cards.</>
        )}
      </p>

      {showMissed && (
        <div className="w-full max-w-xs mb-8 text-left max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-3">Missed</p>
          <ul className="space-y-3">
            {incorrectItems.map((item, index) => (
              <li key={`${item.prompt}-${item.correctAnswer}-${index}`} className="border-b border-zinc-800 pb-3 last:border-0">
                <p className="text-sm text-zinc-400 break-words">{item.prompt}</p>
                <p className="text-sm text-emerald-400 font-bold mt-1 break-words">{item.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-xs space-y-4">
        {/* existing buttons unchanged */}
```

Keep the existing button block and closing tags exactly as before.

- [ ] **Step 3: Typecheck / build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 4: Commit on `dev`**

```bash
git add components/shared/CompletionScreen.tsx
git commit -m "$(cat <<'EOF'
feat: show missed quiz items on completion screen

EOF
)"
```

---

### Task 3: Wire `FillBlankMode` incorrect tracking

**Files:**
- Modify: `components/FillBlankMode.tsx`

**Interfaces:**
- Consumes: `IncorrectItem` from `./shared/CompletionScreen`
- Produces: `incorrectItems` state passed to `<CompletionScreen incorrectItems={incorrectItems} />`; cleared in `handleRestart`

- [ ] **Step 1: Import type and add state**

At the top of `components/FillBlankMode.tsx`, ensure CompletionScreen import becomes:

```tsx
import CompletionScreen, { IncorrectItem } from './shared/CompletionScreen';
```

Inside the component, next to `score` state:

```tsx
const [incorrectItems, setIncorrectItems] = useState<IncorrectItem[]>([]);
```

- [ ] **Step 2: Record misses in `handleSubmit`**

Replace `handleSubmit` with:

```tsx
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
        prompt: gameState.sentence,
        correctAnswer: gameState.hiddenWord,
      },
    ]);
  }
};
```

- [ ] **Step 3: Clear on restart and pass prop**

Replace `handleRestart` with:

```tsx
const handleRestart = () => {
  setScore(0);
  setIncorrectItems([]);
  setCurrentIndex(0);
  setIsFinished(false);
};
```

Update the finished `CompletionScreen` usage:

```tsx
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
```

- [ ] **Step 4: Manual verify FillBlank**

```bash
npm run dev
```

In FillBlank: miss ≥1 question, finish session. Expect Missed list with english prompt + translation answer. Perfect run: no list. Restart: list gone.

- [ ] **Step 5: Commit on `dev`**

```bash
git add components/FillBlankMode.tsx
git commit -m "$(cat <<'EOF'
feat: track incorrect fill-blank answers for completion review

EOF
)"
```

---

### Task 4: Wire `VocabularyMode` incorrect tracking

**Files:**
- Modify: `components/VocabularyMode.tsx`

**Interfaces:**
- Consumes: `IncorrectItem` from `./shared/CompletionScreen`; `data[currentIndex].translation` for prompt
- Produces: same `incorrectItems` prop pattern as FillBlank

- [ ] **Step 1: Import type and add state**

```tsx
import CompletionScreen, { IncorrectItem } from './shared/CompletionScreen';
```

```tsx
const [incorrectItems, setIncorrectItems] = useState<IncorrectItem[]>([]);
```

- [ ] **Step 2: Record misses in `handleSubmit`**

Replace `handleSubmit` with:

```tsx
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
```

- [ ] **Step 3: Clear on restart and pass prop**

```tsx
const handleRestart = () => {
  setScore(0);
  setIncorrectItems([]);
  setCurrentIndex(0);
  setIsFinished(false);
};
```

```tsx
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
```

- [ ] **Step 4: Manual verify Vocabulary + flashcards unchanged**

```bash
npm run dev
```

Vocabulary: miss ≥1 → Missed list shows translation prompt + hidden english word. Perfect → no list. Restart clears. Flashcard finish → no Missed section.

- [ ] **Step 5: Commit on `dev`**

```bash
git add components/VocabularyMode.tsx
git commit -m "$(cat <<'EOF'
feat: track incorrect vocabulary answers for completion review

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| `IncorrectItem` prompt + correctAnswer | Task 2 |
| Optional `incorrectItems` on CompletionScreen | Task 2 |
| Missed list UI (scroll, label, styling) | Task 2 |
| Perfect score hides list | Task 2 (`showMissed`) |
| FillBlank mapping + accumulate + restart clear | Task 3 |
| Vocabulary mapping + accumulate + restart clear | Task 4 |
| Flashcards unchanged | Task 2 optional prop; Task 4 verify |
| Manual verification | Tasks 3–4 |
| Commits on `dev` | All tasks |
| Base files exist on `dev` | Task 1 |
