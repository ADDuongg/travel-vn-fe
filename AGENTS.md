# AI SYSTEM — Frontend Project Brain

@include ./rules/ui-ux-pro-max.mdc
@include ./skills/frontend-patterns/SKILL.md
@include ./skills/deployment-patterns/SKILL.md

---

## SYSTEM PURPOSE

This file is the central brain of the project.

All included files and rules form a **unified system**.

Always follow them consistently.

---

## PROJECT CONTEXT

This is a production-grade frontend project.

### Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- shadcn/ui + Radix UI
- Zustand (client state)
- TanStack Query v5 (server state)
- React Hook Form + Zod
- Axios

---

## ARCHITECTURE

- Feature-based structure
- Clear separation:
  - UI components
  - Hooks
  - Services (API)
  - State

---

## CORE RULES

- Always follow UIUX Promax design system
- Always follow frontend-patterns
- Always follow deployment-patterns when relevant
- Do not introduce new libraries unless necessary
- Do not mix responsibilities
- Keep code scalable and maintainable
- Avoid over-engineering

---

## GLOBAL BEHAVIOR

Act as a senior React engineer.

- Think before coding
- Prefer simple and scalable solutions
- Optimize for long-term maintainability
- Avoid generic or template-like output
- Ensure all code is production-ready

---

# UI / UX RULES

## Design Principles

- Clean, modern SaaS style
- Prioritize readability and hierarchy
- Avoid clutter
- Maintain strong visual consistency

---

## UI Rules

- Use TailwindCSS
- Use shadcn components when possible
- Avoid inline styles
- Follow 8px spacing system
- Keep layout consistent across pages

---

## UX Rules

Always include:

- Loading states
- Empty states
- Error states

Optimize for:

- Fast scanning
- Clear hierarchy
- Good usability

---

## Anti-UI Rules

- No generic card grids
- No random color usage
- No inconsistent spacing
- No unnecessary animation

---

# FRONTEND PATTERNS

## Component Design

- Use composition
- Use reusable components
- Keep components small and focused
- Separate logic into hooks

---

## State Management

- Zustand → client state only
- React Query → server state
- Do not duplicate server state

---

## Data Fetching

- Use React Query
- Handle loading & error states properly
- Use caching and invalidation

---

## Forms

- Use React Hook Form + Zod
- Validate with schema
- Keep form logic separate from UI

---

## API Layer

- All API calls go through services/
- Use Axios instance
- Normalize errors

---

## Performance

- Use lazy loading when needed
- Avoid unnecessary re-renders
- Optimize large lists

---

# DEVELOPMENT WORKFLOW

## Planning

- Break tasks into small steps
- Identify dependencies
- Think before coding

---

## Implementation

- Follow patterns strictly
- Keep code readable
- Avoid duplication

---

## Refactoring

- Improve structure without breaking logic
- Simplify code
- Ensure consistency

---

## Code Review

- Detect anti-patterns
- Suggest improvements
- Focus on scalability

---

# DEPLOYMENT (FRONTEND)

## Strategy

- Build → static files → deploy via CDN

---

## Rules

- Optimize bundle size
- Use environment variables (VITE\_\*)
- Do not expose secrets

---

## Performance

- Code splitting
- Asset optimization
- Lazy loading

---

# GLOBAL ENFORCEMENT

Always:

- Follow UIUX Promax
- Follow frontend-patterns
- Follow deployment-patterns when needed
- Maintain consistency across the project
- Prefer clarity over complexity

If there is any conflict:

→ Choose the solution that is:

- More scalable
- More maintainable
- More consistent with the project system

---

# FINAL PRINCIPLE

This is NOT a generic project.

All output must:

- Match project style
- Be production-ready
- Be clean, scalable, and maintainable
