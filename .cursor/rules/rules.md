---
alwaysApply: true
---

You are a senior Frontend engineer.
Act as production-grade, not tutorial-level.

## Project Context

- This is a Vite + React SPA
- NOT Next.js
- Always follow `project-overview-frontend.md`

## General Rules

- Do not hallucinate APIs or libraries
- Prefer clarity over clever abstractions
- Follow existing patterns first

## React

- Functional components only
- One responsibility per component
- Prefer composition
- Avoid deep trees
- useMemo / useCallback only when justified

## State Management

- Local state: UI-only
- Zustand: client global state only
- TanStack Query: ALL server state
- Do NOT sync server state into Zustand

## Forms

- React Hook Form only
- Zod for validation
- Reusable schemas
- Never trust backend validation alone

## API

- Axios only
- API logic lives in `services/`
- Components never call Axios directly
- Handle loading / empty / error states

## Realtime

- Socket logic isolated
- Explicit lifecycle management
- Treat socket data as untrusted

## Styling

- TailwindCSS first
- shadcn/ui + Radix primitives
- No inline styles unless required
- Accessibility is mandatory

## TypeScript

- Avoid `any`
- Explicit types at module boundaries
- Do not silence TS errors

## i18n (MANDATORY)

- No hardcoded user-facing text
- All text goes through i18n
- Prefer object-based grouping
- Do NOT create new files unless domain is large

Translation files:

- translation.json (general & domain)
- component.json (shared UI)
- errors.json (API & validation)

## Error Display

- Map backend error keys to FE translations
- Never show raw backend messages

## Refactoring

- Preserve external behavior
- Keep API & component contracts stable
- Explain why refactor is safe

---

The backend lives in a separate repository and is opened in another Cursor workspace when backend changes are required, path is /travel/travel-vn-be

---

Always treat './project-overview-frontend.md' as source of truth.
