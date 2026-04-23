# Sentency.io - AI Agent Instructions

## Project Overview
A React/TypeScript language learning app with two game modes: **Flashcards** and **Fill-in-the-Blank Quiz**. Mobile-first design using Tailwind CSS with dark theme (black/zinc palette + indigo accents).

## Architecture & Data Flow

### State Management (All in App.tsx)
- No Redux/Context - uses `useState` for three navigation states: `levels` → `modes` → `game`
- Level data is static (imported from `constants.ts`)
- Navigation: User selects level → selects mode → plays game → returns to mode selection

### Core Components
1. **App.tsx**: Main container managing view state (`levels`, `modes`, `game`) and routing between components
2. **FlashcardMode.tsx**: Spaced repetition flashcards with flip animation
3. **FillBlankMode.tsx**: Quiz mode that randomly hides a word from sentences

### Type System (`types.ts`)
```typescript
ViewState = 'levels' | 'modes' | 'game'  // Navigation states
GameMode = 'flashcards' | 'fill-blank'   // Two game types
Level: { sentences: Sentence[] }         // Level contains array of sentence pairs
Sentence: { english: string, translation: string }  // Bilingual pairs
```

## Key Patterns & Conventions

### Styling Approach
- **Tailwind CDN** (not PostCSS) - classes written inline, no separate CSS files except custom flashcard animations in `index.html`
- Dark theme: `bg-black`, `bg-zinc-900`, `text-white`, `text-zinc-400`
- Primary accent: `bg-indigo-600`, `text-indigo-400`
- Rounded corners: Prefer `rounded-2xl` for cards/buttons
- Mobile-first: `max-w-md mx-auto` wrapper pattern for all views

### Component Structure Pattern
All game mode components follow this structure:
```tsx
// 1. State setup
const [currentIndex, setCurrentIndex] = useState(0);
const [completed, setCompleted] = useState(false);

// 2. Internal GameHeader component
const GameHeader = () => (/* Back button + mode label */);

// 3. Completion screen check
if (completed) return <CompletionUI />;

// 4. Main game UI with progress bar
return (
  <div className="flex-1 flex flex-col bg-black min-h-dvh">
    <GameHeader />
    {/* Progress indicator */}
    {/* Game content */}
  </div>
);
```

### Keyboard Navigation
Both game modes implement keyboard controls via `useEffect` with `window.addEventListener`:
- **FlashcardMode**: Space/Enter to flip, Arrow keys to navigate
- **FillBlankMode**: Arrow Right for next (only after submission)

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev             # Start dev server on localhost:3000
```

### Deployment to GitHub Pages
```bash
npm run build           # Vite build to /dist
npm run deploy          # Build + deploy via gh-pages
```
- **Important**: `vite.config.ts` has `base: '/fill-in-the-blank/'` for GitHub Pages routing
- GitHub Actions workflow in `.github/workflows/deploy.yml` auto-deploys on push to main

## Adding New Features

### Adding a New Level
Edit `constants.ts` → add Level object to `LEVELS` array:
```typescript
{
  id: 'lvl_4',
  name: 'Advanced Grammar',
  difficulty: 'hard',
  color: 'bg-red-100 text-red-700',     // Not actively used in current UI
  accentColor: 'border-red-400',        // Not actively used in current UI  
  sentences: [/* Sentence objects */]
}
```

### Adding a New Game Mode
1. Create component in `components/` following the GameHeader + completion screen pattern
2. Add mode type to `GameMode` union in `types.ts`
3. Update `App.tsx` mode selection UI and game renderer
4. Implement keyboard navigation in `useEffect`

## Important Gotchas

### Flashcard Flip Animation
Custom CSS in `index.html` (not Tailwind) using `perspective` and `rotateY`. Don't try to replicate with Tailwind transforms.

### Word Hiding Logic (`FillBlankMode.tsx`)
- Filters words > 1 letter: `words.filter(w => w.replace(/[^a-zA-Z]/g, '').length > 1)`
- Strips punctuation for comparison: `word.replace(/[.,!?;:"']/g, '')`
- Falls back to first word if no valid candidates

### Transition Delays
Uses `setTimeout` in navigation to allow exit animations: `setTimeout(() => setCurrentIndex(prev => prev + 1), 150)`

## Tech Stack
- **Build**: Vite 6.2
- **Framework**: React 19.2 + TypeScript 5.8
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **Animations**: Framer Motion (imported but minimally used - mostly using Tailwind `animate-in`)
- **Deployment**: GitHub Pages via gh-pages CLI + GitHub Actions
