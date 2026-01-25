# Frontend Project Overview (Travel Platform)

## 1. Project Purpose

This frontend project is a travel platform that provides:
- Hotel room booking
- Tour booking
- Purchase of travel-related products
- Display of famous local foods across Vietnamese provinces and cities


The frontend focuses on:
- User experience
- Performance
- Scalability
- Real-time interaction (booking status, notifications)

---

## 2. Tech Stack

### Core
- ReactJS
- TypeScript & JavaScript
- Vite

### UI & Styling
- TailwindCSS
- shadcn/ui
- Radix UI

### Forms & Validation
- React Hook Form (RHF)
- Zod

### State Management & Data Fetching
- Zustand (global state)
- TanStack Query (React Query)
- Axios

### Realtime
- Socket.IO (client)

---

## 3. High-Level Architecture

- Component-driven architecture
- Feature-based folder organization
- Strong separation between:
  - UI components
  - Business logic
  - API communication
  - Global state

Frontend acts as:
- Consumer of REST APIs
- Consumer of WebSocket events
- Stateless UI (business rules belong to backend)

---

## 4. Project Folder Structure

```txt
src/
├───assets
├───components
│   └───ui
├───constants
├───features
│   ├───auth
│   ├───booking
│   ├───language
│   ├───payment
│   ├───review
│   ├───rooms
│   ├───shared
│   └───tours
├───hooks
├───interface
├───layout
├───lib
├───mock
├───pages
│   ├───auth
│   │   ├───login
│   │   └───register
│   ├───dashboard
│   │   ├───my_account
│   │   ├───room
│   │   │   └───table
│   │   └───tour
│   ├───destination
│   ├───home
│   ├───payment
│   ├───room
│   └───tour
├───sections
│   ├───dashboard
│   ├───home
│   ├───room
│   │   ├───components
│   │   └───room-detail
│   ├───shared
│   └───tour
│       ├───components
│       └───tour-detail
├───shared
│   └───table
├───stores
└───utils
5. State Management Strategy
Local state: Component-level UI state

Zustand:

Auth state

User profile

Cart / booking draft

TanStack Query:

Server state

Caching

Pagination

Background refetching

Avoid duplicating server state in Zustand.

6. API & Data Conventions
All API calls go through services/

Axios instance handles:

Base URL

Auth headers

Error normalization

Use RHF

Validate with Zod

Never trust backend blindly

7. Realtime (Socket.IO)
Socket used for:

Booking status updates

Payment status

Notifications

Socket logic is isolated inside sockets/

Components subscribe/unsubscribe explicitly

8. UI Principles
Use shadcn/ui + Radix UI primitives

Prefer composition over customization

Avoid inline styles

Tailwind utility-first approach

Accessibility is mandatory

9. Non-Goals (Frontend)
No direct business rule implementation

No database logic

No payment logic beyond UI flow

10. Cursor Instructions
Always follow this file as the source of truth for frontend architecture

Do not introduce new libraries without justification

Respect folder responsibilities

Prefer existing hooks, services, and patterns