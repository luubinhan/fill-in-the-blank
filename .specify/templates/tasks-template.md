---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React App (Sentency.io)**: Root-level `.tsx` files and `/components` folder
- Main app logic: `App.tsx` (view state management)
- Game modes: `components/[ModeName].tsx`
- Shared types: `types.ts`
- Static data: `constants.ts`
- Paths shown in examples assume this structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create component structure per implementation plan
- [ ] T002 Update types.ts with required TypeScript interfaces
- [ ] T003 [P] Update constants.ts with new level/sentence data (if applicable)
- [ ] T004 [P] Configure ESLint/Prettier for TypeScript + React (if not present)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks for React app (adjust based on your feature):

- [ ] T005 Update App.tsx navigation state to support new view/mode
- [ ] T006 [P] Create shared UI components (buttons, cards) if needed
- [ ] T007 [P] Setup keyboard event listener utilities
- [ ] T008 Implement base GameHeader component pattern (if new mode)
- [ ] T009 Configure routing in App.tsx for new game mode

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Component test for [ComponentName] in tests/unit/[ComponentName].test.tsx
- [ ] T011 [P] [US1] E2E test for [user journey] in tests/e2e/[feature].spec.ts

### Implementation for User Story 1

- [ ] T012 [P] [US1] Add types to types.ts: [TypeName] interface
- [ ] T013 [P] [US1] Add data to constants.ts (if applicable)
- [ ] T014 [US1] Create component components/[ComponentName].tsx
- [ ] T015 [US1] Implement state management with useState hooks
- [ ] T016 [US1] Implement GameHeader pattern with back button
- [ ] T017 [US1] Implement keyboard navigation in useEffect
- [ ] T018 [US1] Add completion screen with progress stats
- [ ] T019 [US1] Style with Tailwind CSS (mobile-first, dark theme)
- [ ] T020 [US1] Connect to App.tsx routing logic

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Component test for [ComponentName] in tests/unit/[ComponentName].test.tsx
- [ ] T022 [P] [US2] E2E test for [user journey] in tests/e2e/[feature].spec.ts

### Implementation for User Story 2

- [ ] T023 [P] [US2] Add types to types.ts (if new types needed)
- [ ] T024 [P] [US2] Add data to constants.ts (if applicable)
- [ ] T025 [US2] Create component components/[ComponentName].tsx
- [ ] T026 [US2] Implement component structure following established pattern
- [ ] T027 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T028 [P] [US3] Component test for [ComponentName] in tests/unit/[ComponentName].test.tsx
- [ ] T029 [P] [US3] E2E test for [user journey] in tests/e2e/[feature].spec.ts

### Implementation for User Story 3

- [ ] T030 [P] [US3] Add types/data as needed
- [ ] T031 [US3] Create component components/[ComponentName].tsx
- [ ] T032 [US3] Implement feature following established patterns

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Update .github/copilot-instructions.md with new patterns
- [ ] TXXX [P] Mobile responsiveness testing on actual devices
- [ ] TXXX [P] Keyboard navigation verification
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Verify Vite build succeeds (npm run build)
- [ ] TXXX Test GitHub Pages deployment preview
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
