# Speaking Completion Mode Selection

## Goal

Allow a learner who entered a level from `SpeakingView` to start another game mode for the same level directly from the completion screen.

## Design

Add an optional mode-selection callback to the shared completion screen and thread it through game components. `App` supplies it only when the current game originated from `SpeakingView`; selecting a mode starts that mode immediately with the selected level and the speaking source view. The existing level-selection handler should be reused so navigation state and the URL remain consistent.

Show the same three options used by `SpeakingView`—Flashcards, Quiz, and Speaking—only when the callback is provided. Keep existing completion actions and all completion screens from the regular level list unchanged.

## Validation

Run the production build and verify that the mode options are wired only for games with `sourceView === 'speaking'`, and that each option selects the current level with the requested mode.
