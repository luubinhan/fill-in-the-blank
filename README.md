# Sentency

A modern, interactive language learning application built with React and TypeScript. Sentency.io helps users master sentence construction through engaging flashcard and fill-in-the-blank exercises.

## Features

### 🎯 Multiple Learning Modes
- **Flashcard Mode**: Review sentences with their translations
- **Fill-in-the-Blank Mode**: Test your understanding by completing sentences

### 📚 Progressive Difficulty Levels
- **Beginner Explorer**: Short and sweet sentences for starting out
- **Sentence Builder**: Longer sentences with more details
- **Master Storyteller**: Complex sentences for super learners

### ✨ Modern UI/UX
- Clean, dark-themed interface
- Smooth animations with Framer Motion
- Responsive design optimized for all devices
- Keyboard navigation support
- Real-time feedback on answers

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fill-in-the-blank.git
cd fill-in-the-blank
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
fill-in-the-blank/
├── components/
│   ├── FillBlankMode.tsx    # Fill-in-the-blank game component
│   └── FlashcardMode.tsx    # Flashcard review component
├── App.tsx                  # Main application component
├── constants.ts             # Level and sentence data
├── types.ts                 # TypeScript type definitions
├── index.tsx                # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## How to Play

1. **Select a Level**: Choose from Beginner, Intermediate, or Advanced difficulty
2. **Pick a Mode**: 
   - Choose Flashcards to review sentences
   - Choose Fill-in-the-Blank to test your skills
3. **Complete Exercises**: Work through the sentences and track your progress
4. **Review Results**: See your score and identify areas for improvement

## Customization

### Adding New Sentences

Edit [constants.ts](constants.ts) to add new levels or sentences:

```typescript
{
  id: 'unique_id',
  english: "Your sentence here.",
  translation: "Translation or hint.",
  difficulty: 'easy' | 'medium' | 'hard'
}
```

### Modifying Difficulty Levels

Update the `LEVELS` array in [constants.ts](constants.ts) to customize level names, descriptions, and colors.

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
