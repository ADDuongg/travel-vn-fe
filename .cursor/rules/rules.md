---
globs:
alwaysApply: true
---

# Frontend Cursor Rules

You are an expert senior Frontend developer.
You think in terms of architecture, maintainability, performance, and user experience.
Act as a production-grade engineer, not a tutorial bot.

This project DOES NOT use Next.js.
It is a Vite + React SPA.

---

## 1. General Engineering Principles

- Do NOT hallucinate APIs, libraries, or framework features.
- Ask clarifying questions if requirements are ambiguous.
- Prefer simple, explicit solutions over clever abstractions.
- Follow existing patterns in the codebase before introducing new ones.
- Assume this code will be maintained by a team long-term.
- Never sacrifice readability for brevity.

---

## 2. Tech Stack (Source of Truth)

This frontend project uses:

- ReactJS (SPA)
- TypeScript & JavaScript
- Vite
- TailwindCSS
- shadcn/ui
- Radix UI
- React Hook Form (RHF)
- Zod
- Zustand
- TanStack Query (React Query)
- Axios
- Socket.IO (client)
- and others

DO NOT:
- Suggest libraries outside this stack unless explicitly requested

---

## 3. Project Context

- Always treat `project-overview-frontend.md` as the source of truth.
- Follow the folder structure and responsibilities defined there.
- If an implementation conflicts with documented architecture, point it out.

---

## 4. React & Component Design

- Use functional components only.
- Prefer composition over prop drilling and inheritance.
- Keep components small and focused on a single responsibility.
- Avoid deeply nested component trees.
- Memoization (`useMemo`, `useCallback`) only when justified.
- Do not introduce premature optimization.

---

## 5. State Management Rules

### Local State
- Use component state for UI-only concerns.
- Avoid syncing local state with server state.

### Zustand
- Use for global client state (auth, cart, booking draft).
- Keep stores minimal and domain-focused.
- Avoid mixing server state into Zustand.

### TanStack Query
- Use for all server state.
- Leverage caching, pagination, and invalidation properly.
- Do NOT manually manage loading/error state already handled by React Query.

---

## 6. Forms & Validation

- All forms must use React Hook Form.
- Validation must be done with Zod.
- Zod schemas should be reusable and colocated logically.
- Never trust backend validation alone.
- Avoid uncontrolled inputs.

---

## 7. API & Data Fetching

- All HTTP calls must go through Axios instances.
- API logic must live in `services/`.
- Components must not call Axios directly.
- Handle error states explicitly.
- Assume API responses follow a consistent contract.

---

## 8. Realtime (Socket.IO)

- Socket logic must be isolated (no socket calls inside UI components directly).
- Subscribe and unsubscribe explicitly.
- Do not couple socket events tightly with UI rendering.
- Treat socket data as external, untrusted input.

---

## 9. Styling & UI System

- Use TailwindCSS as the primary styling solution.
- Use shadcn/ui and Radix UI primitives for accessible components.
- Avoid inline styles unless strictly necessary.
- Prefer utility classes over custom CSS.
- Accessibility is not optional.

---

## 10. TypeScript Rules

- Avoid `any` unless explicitly justified.
- Prefer explicit types at module boundaries.
- Use inferred types inside functions when clear.
- Do not silence TypeScript errors without explanation.

---

## 11. Error Handling & Edge Cases

- Always consider loading, empty, and error states.
- Handle race conditions in async logic.
- Do not assume data is always present.
- Fail gracefully in the UI.

---

## 12. Refactoring Guidelines

- Do NOT change external behavior unless requested.
- Preserve existing APIs and component contracts.
- Improve readability and structure incrementally.
- Explain why a refactor is safe.

---

## 13. Output Expectations

- Provide production-ready, pasteable code.
- Ensure TypeScript compiles.
- Explain reasoning briefly when necessary.
- If multiple solutions exist, compare trade-offs.

---

## 14. What NOT To Do

- Do not introduce new libraries casually.
- Do not rewrite large parts of the codebase without context.
- Do not move backend logic into frontend.
- Do not assume Next.js or SSR capabilities.

## 15. Internationalization (i18n)

This project supports multiple languages (i18n).
All user-facing text MUST be translatable.

### General Principles

- Do NOT hardcode user-facing strings directly in components.
- All visible text must go through the i18n system.
- Text content must be language-agnostic.
- UI layout must account for text length differences between languages.

---

### Translation Structure

- Translations must be organized by:
  - Language
  - Feature or domain (not by page only)

Example:

---
locales/
├─ en/
│  ├─ translation.json
├─ vi/
│  ├─ translation.json

## 16. Translation File Management

Internationalization (i18n) – Simplified Rules

This project supports multiple languages (i18n).
All user-facing text MUST be translatable.

1. General Principles

❌ Do NOT hardcode user-facing strings in components

✅ All visible text must go through the i18n system

✅ Text must be language-agnostic

✅ UI must tolerate different text lengths

✅ Prefer clear structure over too many files

2. Translation Structure (Simple & Scalable)

Translations are organized by language, with a small number of well-defined files.

/public/locales/
├─ en/
│  ├─ translation.json
│  ├─ component.json
│  ├─ errors.json
│  └─ auth.json        (optional, only if needed)
├─ vi/
│  ├─ translation.json
│  ├─ component.json
│  ├─ errors.json
│  └─ auth.json

Core files
File	Purpose
translation.json	General content, page text, business text
component.json	Reusable UI components (buttons, modals, table, form…)
errors.json	Validation, API, system errors
auth.json	Auth-related text (optional)

👉 Do NOT create new files unless a domain is clearly large enough.

3. Object-based Key Grouping (IMPORTANT)

If multiple strings share the same context, they MUST be grouped as an object.

✅ Good (grouped by context)
{
  "booking": {
    "title": "Book now",
    "subtitle": "Choose your schedule",
    "confirm": "Confirm booking",
    "cancel": "Cancel booking"
  }
}

{
  "table": {
    "empty": "No data available",
    "loading": "Loading data...",
    "rowsPerPage": "Rows per page"
  }
}

❌ Bad (flat & hard to maintain)
{
  "bookingTitle": "Book now",
  "bookingSubtitle": "Choose your schedule",
  "bookingConfirm": "Confirm booking"
}

4. File Responsibility Rules
translation.json

Page-level content

Business text

Domain-specific content (if not too large)

{
  "hotel": {
    "title": "Hotel information",
    "address": "Address",
    "description": "Description"
  }
}

component.json

Shared UI components

Buttons, modals, form labels, placeholders

{
  "button": {
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit"
  },
  "modal": {
    "confirmTitle": "Confirm action",
    "confirmMessage": "Are you sure?"
  }
}

errors.json

API errors

Validation errors

System messages

{
  "required": "This field is required",
  "invalidEmail": "Invalid email address",
  "server": {
    "500": "Internal server error",
    "403": "Access denied"
  }
}

5. Key Naming Rules

Keys must be:

✅ descriptive

✅ grouped by context

✅ stable over time

❌ NOT UI-position-based

❌ Bad
{
  "title": "Book now"
}

✅ Good
{
  "booking": {
    "title": "Book now"
  }
}

6. When to Create a New File?

Only create a new translation file if ALL conditions are met:

Domain is large (20–30+ keys)

Domain is reused across many pages

Domain has clear boundaries (e.g. auth, profile, payment)

Otherwise → keep it in translation.json and group by object.

7. Cursor / AI Guidance (Recommended)

Cursor should:

Prefer existing files

Prefer object grouping

Avoid creating new files unnecessarily

Extend existing objects when context matches

---

Backend error messages must be mapped by error code.
Never display backend raw messages directly to users.

---

If a feature change requires backend modification:
- Explicitly state required backend changes
- Do not assume backend is already updated

## 17. Testing
Unit Testing
- Write thorough unit tests to validate individual functions and components.
- Use Jest for reliable and efficient testing of React components.
- Follow patterns like Arrange-Act-Assert to ensure clarity and consistency in tests.
- Mock external dependencies and API calls to isolate unit tests.

Integration Testing
- Focus on user workflows to ensure app functionality.
- Set up and tear down test environments properly to maintain test independence.
- Use snapshot testing selectively to catch unintended UI changes without over-relying on it.
- Leverage testing utilities (e.g., screen in RTL) for cleaner and more readable tests.

---
The backend lives in a separate repository and is opened in another Cursor workspace when backend changes are required, path is /travel/travel-vn-be

---
Always consider project-overview-frontend.md as the source of truth.