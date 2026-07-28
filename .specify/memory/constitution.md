<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Principles Established:
  - Component-First Architecture
  - Mobile-First Design
  - Accessibility & Keyboard Navigation
  - Type Safety & Static Data
  - Deployment Automation

Templates Status:
  ✅ plan-template.md - Updated with React/TypeScript context, Component-First gates, and project structure
  ✅ spec-template.md - User stories and requirements compatible (no changes needed)
  ✅ tasks-template.md - Updated with React component workflow and TypeScript/Tailwind patterns
  ✅ checklist-template.md - Not reviewed (project-agnostic)
  ✅ agent-file-template.md - Not reviewed (project-agnostic)

Follow-up TODOs:
  - Consider adding E2E testing principle as app grows (future MINOR bump)
  - Define performance budgets for mobile devices (future MINOR bump)
  - Add bundle size monitoring if app exceeds 100KB (future PATCH)
-->

# Sentency.io Constitution

## Core Principles

### I. Component-First Architecture

Every feature MUST be implemented as a self-contained React component with:
- Clear single responsibility (one game mode or one view state)
- Defined props interface via TypeScript
- Internal state management using `useState` hooks
- Reusable GameHeader pattern for consistent navigation
- Completion screen handling following established pattern

**Rationale**: Maintains consistency across game modes, enables independent testing, and simplifies maintenance by enforcing predictable component structure.

### II. Mobile-First Design

All UI components MUST:
- Use `max-w-md mx-auto` wrapper for mobile-optimized layout
- Implement dark theme with approved color palette: `bg-black`, `bg-zinc-900`, `text-white`, `text-zinc-400`, `bg-indigo-600`
- Use `rounded-2xl` for cards and buttons
- Apply `min-h-dvh` for full-screen views
- Test on mobile viewport sizes before desktop

**Rationale**: Target audience is language learners on mobile devices; mobile-first ensures optimal user experience on primary platform.

### III. Accessibility & Keyboard Navigation

All interactive components MUST:
- Implement keyboard controls via `useEffect` with `window.addEventListener`
- Document keyboard shortcuts in component comments
- Support standard navigation patterns (Arrow keys, Space, Enter)
- Include visual focus indicators for interactive elements
- Maintain semantic HTML structure

**Rationale**: Ensures app is usable without mouse/touch, supports assistive technologies, and provides better UX for power users.

### IV. Type Safety & Static Data

All code MUST:
- Define TypeScript interfaces in `types.ts` for shared types
- Use strict typing for component props and state
- Store static content (levels, sentences) in `constants.ts`
- Avoid `any` types unless explicitly justified
- Export Level/Sentence/GameMode types for consistency

**Rationale**: TypeScript catches errors at compile time, self-documents data structures, and enables confident refactoring.

### V. Deployment Automation

All code changes MUST:
- Pass Vite build without errors before merge
- Maintain `base: '/fill-in-the-blank/'` in vite.config.ts for GitHub Pages routing
- Preserve GitHub Actions workflow in `.github/workflows/deploy.yml`
- Auto-deploy on push to `dev` branch
- Test deployment locally with `npm run build && npm run preview` before pushing

**Rationale**: Automated deployment reduces human error, ensures consistent builds, and enables rapid iteration.

## Technology Stack Constraints

**Required Stack** (NON-NEGOTIABLE):
- **Build Tool**: Vite 6.2+
- **Framework**: React 19+ with TypeScript 5.8+
- **Styling**: Tailwind CSS via CDN (no PostCSS builds)
- **Icons**: Lucide React
- **Animations**: Tailwind utility classes preferred; Framer Motion available but minimally used

**Forbidden Patterns**:
- ❌ No Redux or Context API (use local useState)
- ❌ No separate CSS files (inline Tailwind only, except animations in index.html)
- ❌ No server-side rendering (static site only)
- ❌ No external API calls (all data local)

**Rationale**: Maintains simplicity, reduces bundle size, and ensures fast load times for educational app.

## Development Workflow

**Feature Addition Process**:
1. Define new Level in `constants.ts` OR new game mode component
2. Update `types.ts` if new types needed
3. Follow established component structure pattern:
   - State setup
   - Internal GameHeader component
   - Completion screen check
   - Main game UI with progress bar
4. Implement keyboard navigation in `useEffect`
5. Test on mobile viewport first
6. Update `.github/copilot-instructions.md` with new patterns

**Code Review Requirements**:
- Type safety: No `any` types without justification
- Accessibility: Keyboard navigation implemented and tested
- Mobile responsiveness: Tested on mobile viewport
- Follows established patterns: GameHeader, completion screen, progress indicator
- No new dependencies without approval

**Rationale**: Structured process ensures consistency and maintainability as app evolves.

## Governance

This constitution supersedes all other development practices. All feature implementations, code reviews, and architectural decisions MUST align with these principles.

**Amendment Process**:
- Amendments require update to this document with version bump
- Breaking changes (removing/redefining principles) = MAJOR bump
- New principles or expanded guidance = MINOR bump
- Clarifications or wording fixes = PATCH bump
- Update `.specify/templates/*.md` files to reflect changes
- Maintain sync impact report at top of document

**Compliance**:
- Use `.github/copilot-instructions.md` for runtime development guidance
- Reference this constitution during spec/plan/task creation
- Flag violations in code review
- Justify any complexity that deviates from "Simplicity & YAGNI"

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
