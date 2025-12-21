# Tasks: 甘特圖專案進度檢視

**Input**: Design documents from `/specs/001-gantt-chart-view/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure, using Next.js 14+ App Router pattern:
- **Frontend**: `app/`, `components/`, `lib/`
- **Database**: `prisma/`
- **Tests**: `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Next.js project structure per implementation plan
- [X] T002 Initialize TypeScript 5.x project with Next.js 14+ dependencies
- [X] T003 [P] Configure ESLint and Prettier tools
- [X] T004 [P] Setup Tailwind CSS v4 configuration
- [X] T005 [P] Initialize Prisma ORM with PostgreSQL configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create database schema in prisma/schema.prisma
- [X] T007 Setup NextAuth.js configuration in app/api/auth/[...nextauth]/route.ts
- [X] T008 [P] Create base User model with role-based permissions in lib/types/user.ts
- [X] T009 [P] Create Project entity with validation in lib/types/project.ts
- [X] T010 [P] Create ProjectHistory entity in lib/types/history.ts
- [X] T011 Setup database migrations and seed data in prisma/migrations/
- [X] T012 [P] Configure environment variables template in .env.example
- [X] T013 [P] Create error handling middleware in lib/utils/error-handler.ts
- [X] T014 [P] Setup date processing utilities using date-fns in lib/utils/date.ts
- [X] T015 [P] Create progress calculation utilities in lib/utils/progress.ts
- [X] T016 [P] Setup validation utilities in lib/utils/validation.ts
- [X] T017 Create base UI components (Button, Dialog, ErrorMessage) in components/ui/
- [X] T018 [P] Setup authentication context and hooks in lib/hooks/useAuth.ts
- [X] T019 [P] Create permission checking hooks in lib/hooks/usePermissions.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 檢視專案甘特圖 (Priority: P1) 🎯 MVP

**Goal**: 專案管理者能以甘特圖視覺化方式檢視所有專案的時間軸和進度狀態，快速了解專案整體時程安排和當前狀況

**Independent Test**: 載入專案列表並顯示甘特圖介面，提供專案時程的視覺化價值

### Implementation for User Story 1

- [X] T020 [P] [US1] Create GanttChart main component in components/gantt/GanttChart.tsx
- [X] T021 [P] [US1] Create GanttTimeline component for time axis in components/gantt/GanttTimeline.tsx
- [X] T022 [P] [US1] Create GanttRow component for project lanes in components/gantt/GanttRow.tsx
- [X] T023 [P] [US1] Create GanttBar component for progress visualization in components/gantt/GanttBar.tsx
- [X] T024 [P] [US1] Create TimeScaleSelector component in components/gantt/TimeScaleSelector.tsx
- [X] T025 [US1] Implement GET /api/projects route handler in app/api/projects/route.ts
- [X] T026 [US1] Create useProjects hook for data fetching in lib/hooks/useProjects.ts
- [X] T027 [US1] Create useGanttScale hook for time scaling in lib/hooks/useGanttScale.ts
- [X] T028 [US1] Implement Gantt chart main page in app/gantt/page.tsx
- [X] T029 [US1] Create loading component for Gantt page in app/gantt/loading.tsx
- [X] T030 [US1] Add navigation and layout for Gantt in app/gantt/layout.tsx
- [X] T031 [US1] Integrate SVG-based chart rendering with Tailwind styles
- [X] T032 [US1] Implement project timeline calculation and display logic
- [X] T033 [US1] Add responsive design for different screen sizes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 指派專案負責人 (Priority: P2)

**Goal**: 具有編輯權限的專案管理者能為每個專案指派負責人，並在甘特圖中顯示負責人資訊，以便追蹤專案責任歸屬

**Independent Test**: 選擇專案和指派負責人功能，提供專案責任管理價值

### Implementation for User Story 2

- [X] T034 [P] [US2] Create ResponsiblePersonSelector component in components/project/ResponsiblePersonSelector.tsx
- [X] T035 [P] [US2] Create ProjectForm component for editing in components/project/ProjectForm.tsx
- [X] T036 [US2] Implement GET /api/users route handler in app/api/users/route.ts
- [X] T037 [US2] Implement PUT /api/projects/[id] route handler in app/api/projects/[id]/route.ts
- [X] T038 [US2] Create useUsers hook for fetching users in lib/hooks/useUsers.ts
- [X] T039 [US2] Add responsible person display to GanttBar component
- [X] T040 [US2] Implement project editing modal integration
- [X] T041 [US2] Add permission checks for editing operations
- [X] T042 [US2] Update project history tracking for assignments
- [X] T043 [US2] Add validation for responsible person assignment

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 設定專案時間 (Priority: P3)

**Goal**: 具有編輯權限的專案管理者能設定和調整專案的開始時間和結束時間，並在甘特圖中即時反映變更

**Independent Test**: 修改專案時間並檢視甘特圖更新，提供時程管理價值

### Implementation for User Story 3

- [ ] T044 [P] [US3] Create DateRangePicker component in components/project/DateRangePicker.tsx
- [ ] T045 [US3] Implement date validation logic in project form
- [ ] T046 [US3] Add real-time Gantt chart updates using optimistic updates
- [ ] T047 [US3] Implement drag-and-drop time adjustment in Gantt bars
- [ ] T048 [US3] Add date range conflict detection and warnings
- [ ] T049 [US3] Implement progress recalculation on date changes
- [ ] T050 [US3] Add keyboard shortcuts for time editing
- [ ] T051 [US3] Create time editing confirmation dialogs
- [ ] T052 [US3] Add undo/redo functionality for time changes

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T053 [P] Add comprehensive error boundaries in app/error.tsx
- [ ] T054 [P] Implement performance optimization with React.memo and useMemo
- [ ] T055 [P] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] T056 [P] Implement virtual scrolling for large project lists
- [ ] T057 Code cleanup and refactoring across all components
- [ ] T058 Add loading states and skeleton components
- [ ] T059 [P] Implement dark mode support with Tailwind CSS
- [ ] T060 [P] Add internationalization support for UI text
- [ ] T061 Performance testing and optimization
- [ ] T062 Security audit and hardening
- [ ] T063 Run quickstart.md validation scenarios

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent but may reuse US1 components
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent but integrates with US1 and US2

### Within Each User Story

- Models before services before UI components
- API routes before client-side hooks
- Base components before integration
- Core implementation before advanced features

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all base components for User Story 1 together:
Task: "Create GanttChart main component in components/gantt/GanttChart.tsx"
Task: "Create GanttTimeline component for time axis in components/gantt/GanttTimeline.tsx"
Task: "Create GanttRow component for project lanes in components/gantt/GanttRow.tsx"
Task: "Create GanttBar component for progress visualization in components/gantt/GanttBar.tsx"
Task: "Create TimeScaleSelector component in components/gantt/TimeScaleSelector.tsx"
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
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Focus on Next.js App Router patterns and TypeScript strict mode
- Ensure all components follow Tailwind CSS v4 design system
- Validate against WCAG 2.1 AA accessibility standards