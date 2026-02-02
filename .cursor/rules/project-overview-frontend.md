# Frontend Project Overview (Source of Truth)

## Purpose

This frontend is a travel platform SPA:

- Hotel & room booking
- Tour booking
- Travel product purchase
- Vietnamese local food discovery

Frontend focuses on:

- UX & performance
- Scalability
- Realtime updates (booking, payment, notification, ...)

Frontend is a consumer only.
Business logic lives in backend.

## Tech Stack

- React (SPA) + Vite
- TypeScript
- TailwindCSS
- shadcn/ui + Radix UI
- React Hook Form + Zod
- Zustand
- TanStack Query V5
- Axios
- Socket.IO (client)

## Architecture Rules

- Component-driven
- Feature-based folders
- Clear separation:
  - UI components
  - Hooks
  - Services (API)
  - Global state

No backend logic in frontend.

## State Management

- Local state: UI-only
- Zustand: client global state (auth, cart, booking draft)
- TanStack Query: server state
- Do NOT duplicate server state in Zustand

## API & Data

- All API calls go through `services/`
- Axios instance handles auth & error normalization
- Never trust backend blindly

## Realtime

- Socket logic is isolated
- Explicit subscribe / unsubscribe
- Socket data is untrusted input

## UI Principles

- Tailwind utility-first
- Use shadcn/ui & Radix primitives
- Accessibility is mandatory
- Avoid inline styles

## Non-goals

- No business rules
- No payment logic
- No DB logic

## Cursor Instruction

- Always treat this file as frontend source of truth
- Follow existing patterns & folders
- Do not add new libraries casually
