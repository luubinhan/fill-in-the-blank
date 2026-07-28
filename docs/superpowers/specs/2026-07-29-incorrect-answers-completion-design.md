# Incorrect answers on completion screen

## Goal

After a quiz session, show each question the user answered incorrectly: **prompt + correct answer**. Scope: FillBlank and Vocabulary modes only. Flashcard modes unchanged.

## Approach

Optional `incorrectItems` prop on shared `CompletionScreen`. Quiz modes accumulate wrong items on submit; pass the list when finished. Flashcard callers omit the prop.

## Data model

```ts
type IncorrectItem = {
  prompt: string;
  correctAnswer: string;
};
```

`CompletionScreen` props addition:

- `incorrectItems?: IncorrectItem[]`

## Mode mapping

| Mode | When to push | `prompt` | `correctAnswer` |
|------|--------------|----------|-----------------|
| FillBlankMode | submit and `isCorrect === false` | English sentence | Expected translation (`hiddenWord`) |
| VocabularyMode | submit and `isCorrect === false` | Shown translation hint | Hidden English word (`hiddenWord`) |

On restart: clear `incorrectItems`, score, and current index (same as today for score/index).

## UI

- Keep existing header (“Practice Complete!”) and score line (“You scored X out of Y”).
- If `incorrectItems.length > 0`: label (e.g. “Missed”) + scrollable list under the score.
- Each row: prompt (muted), correct answer (emphasized).
- Cap list height so action buttons remain reachable; list scrolls when many misses.
- Perfect score (`incorrectItems` empty or omitted): no list.
- Buttons (Try Again / Next / Another topic / Back to Home) unchanged.

## Out of scope

- Showing the user’s wrong typed answer
- Flashcard / SpeakingFlashcard completion changes
- Persisting incorrect answers across sessions
- Automated tests (manual verification only for this change)

## Manual verification

1. FillBlank: miss at least one → finish → list shows prompt + correct answer for each miss.
2. Vocabulary: same.
3. Perfect run → score only, no list.
4. Restart → list and score clear for the new run.
5. Flashcard finish → still no incorrect list.

## Git

Implement and commit on `main`.
