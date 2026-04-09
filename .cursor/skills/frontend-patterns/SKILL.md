# Frontend Architecture & Patterns

> Opinionated guide for a production-grade React + TypeScript travel platform.
> Written from a senior architect's perspective — keeps what works, fixes what doesn't.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [API Layer](#3-api-layer)
4. [React Query Patterns](#4-react-query-patterns)
5. [State Management (Zustand)](#5-state-management-zustand)
6. [Form Handling](#6-form-handling)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Loading & Skeleton Patterns](#8-loading--skeleton-patterns)
9. [Routing & Code Splitting](#9-routing--code-splitting)
10. [Component Patterns](#10-component-patterns)
11. [TypeScript Patterns](#11-typescript-patterns)
12. [Caching Strategy](#12-caching-strategy)
13. [Anti-Patterns & Common Mistakes](#13-anti-patterns--common-mistakes)

---

## 1. Architecture Overview

### Stack

| Layer        | Tool                       | Role                            |
| ------------ | -------------------------- | ------------------------------- |
| Framework    | React 18 + TypeScript      | UI runtime                      |
| Build        | Vite                       | Dev server + bundler            |
| Styling      | TailwindCSS + shadcn/ui    | Design system                   |
| Server State | TanStack React Query       | Async data, caching, sync       |
| Client State | Zustand                    | Auth, UI flags, ephemeral state |
| Forms        | React Hook Form + Zod      | Validation, field state         |
| Routing      | React Router v6 (data API) | SPA navigation, code splitting  |
| HTTP         | Axios (singleton client)   | API communication               |

### Core Principle

> React Query owns server state. Zustand owns client state. Never mix them.

If data comes from the server → React Query.
If data is UI-only (sidebar open, theme, language) → Zustand.

---

## 2. Folder Structure

### Current Structure (simplified)

```
src/
├── components/        # Shared UI + shadcn/ui
├── constants/         # Route constants, enums
├── features/          # Domain API + hooks + types (flat)
├── hooks/             # App-level hooks
├── types/             # Cross-cutting TS types (api, auth, commons)
├── layout/            # Page layouts
├── lib/               # Axios, ErrorBoundary, Loadable, socket
├── mock/              # Mock data
├── pages/             # Route-level screens
├── sections/          # Large UI blocks for pages
├── stores/            # Zustand stores
├── utils/             # Small helpers
├── AppRouter.tsx
├── router.tsx
└── main.tsx
```

### Problems Identified

1. **`sections/` is ambiguous** — sits between feature-based and page-based organization. It creates indirection: to understand a page, you jump between `pages/`, `sections/`, `features/`, and `components/`.
2. **`features/` is flat** — works now with ~12 domains, but will collide when any domain grows (tours already has 6+ files).
3. **Resolved:** cross-cutting types now live in `types/` (`api.ts`, `auth.ts`, `commons.ts`). Imports use `@/types/...` (legacy `@interface/*` removed).
4. **Path alias mismatch** — `@store/*` maps to `src/store/` but the folder is `src/stores/`.
5. **Shared types split** — domain booking/tour shapes in `features/shared/types.ts`; pagination, routes, forms, and table UI state in `types/`.

### Improved Structure

```
src/
├── app/                    # App shell
│   ├── providers.tsx       # All providers composed
│   ├── router.tsx          # Route config + lazy imports
│   └── main.tsx            # Entry point
│
├── components/             # Shared, reusable UI
│   ├── ui/                 # shadcn primitives (button, card, input...)
│   ├── feedback/           # LoadingScreen, EmptyState, ErrorFallback
│   ├── form/               # CustomInput, FormField wrappers
│   └── layout/             # Container, Section, PageHeader
│
├── features/               # Domain modules (self-contained)
│   ├── auth/
│   │   ├── api.ts          # API functions
│   │   ├── hooks.ts        # React Query hooks
│   │   ├── keys.ts         # Query key factory
│   │   ├── types.ts        # Domain types
│   │   ├── schemas.ts      # Zod schemas
│   │   ├── store.ts        # Zustand slice (if needed)
│   │   └── components/     # Feature-specific UI
│   ├── hotels/
│   ├── tours/
│   ├── rooms/
│   ├── booking/
│   ├── review/
│   ├── notifications/
│   └── payment/
│
├── hooks/                  # App-level hooks (useMediaQuery, useMinLoading)
├── lib/                    # Infrastructure (axios, socket, auth-token)
├── types/                  # Cross-cutting types (api.ts, commons.ts)
├── utils/                  # Pure utility functions
├── constants/              # Enums, route paths
├── pages/                  # Thin route components (compose features)
└── layouts/                # MainLayout, DashboardLayout, ListLayout
```

### Key Changes

| Before              | After                                 | Why                                    |
| ------------------- | ------------------------------------- | -------------------------------------- |
| `sections/`         | `features/*/components`               | Colocate UI with its domain            |
| `interface/`        | `types/`                              | Standard naming, no `.tsx` for non-JSX |
| Flat `features/`    | Nested with `/components`, `/schemas` | Scales when domain grows               |
| `stores/` (3 files) | `features/*/store.ts`                 | Colocate store with feature            |
| `@store/*` alias    | Fix to `@stores/*` or rename folder   | Eliminate confusion                    |

### DO

- Keep each feature self-contained: api, hooks, keys, types, schemas, components
- A feature folder must never import from another feature's internal files — only from its public exports (barrel `index.ts`)
- Pages are thin: import feature hooks + components, compose layout

### DON'T

- Don't put business UI in `components/` — that's for truly shared, domain-agnostic pieces
- Don't create a `sections/` folder — it's a halfway pattern that fragments ownership
- Don't mix `.tsx` and `.ts` for non-JSX files

---

## 3. API Layer

### Current Approach (Good Foundation)

The `AxiosClient` singleton is solid:

- Token injection via request interceptor
- Response unwrapping (`res.data.data`)
- Typed methods (`get<T>`, `post<T, D>`)
- `rawResponse` escape hatch
- `paramsSerializer` for array params

### Problems Identified

1. **Error interceptor loses type info** — `Promise.reject({ ...error, message })` spreads an AxiosError into a plain object, dropping the prototype chain and making `instanceof` checks impossible.
2. **No request cancellation** — queries don't pass `AbortSignal` for cleanup on unmount.
3. **No retry/refresh token flow** — if access token expires mid-session, requests just fail. No automatic retry with refreshed token.
4. **Hardcoded timeout** — 10s is aggressive for file uploads or slow connections.
5. **`fetch` used in parallel** — `useChatBot` uses raw `fetch` instead of the Axios client, bypassing auth and error handling.

### Improved API Layer

```typescript
// lib/api-client.ts

import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { authUtils } from './auth-token';

declare module 'axios' {
  interface AxiosRequestConfig {
    rawResponse?: boolean;
    skipAuth?: boolean;
  }
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  paramsSerializer: { indexes: null },
});

// Auth injection
client.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = authUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response unwrapping + error normalization
client.interceptors.response.use(
  (res) => (res.config.rawResponse ? res : res.data?.data),
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred',
      status: error.response?.status ?? 0,
      code: error.code ?? 'UNKNOWN',
      original: error,
    };
    return Promise.reject(apiError);
  },
);

export type ApiError = {
  message: string;
  status: number;
  code: string;
  original: AxiosError;
};

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'code' in error &&
    'original' in error
  );
}

export default client;
```

### Passing AbortSignal to Queries

```typescript
// features/hotels/api.ts
export function getHotels(params?: GetHotelsParams, signal?: AbortSignal) {
  return api.get<Hotel[]>('/api/v1/hotels', { params, signal });
}

// features/hotels/hooks.ts
export function useHotelsQuery(params?: GetHotelsParams) {
  return useQuery({
    queryKey: hotelKeys.list(params),
    queryFn: ({ signal }) => getHotels(params, signal),
    staleTime: 5 * 60_000,
  });
}
```

### DO

- Always pass `signal` from React Query's `queryFn` context to API calls
- Use a structured `ApiError` type — never spread AxiosError into a plain object
- Keep all HTTP through the singleton client — no raw `fetch` calls
- Use `skipAuth` flag for public endpoints instead of a separate client

### DON'T

- Don't use `fetch` alongside Axios — it bypasses interceptors
- Don't hardcode API version in every function — use a base path constant
- Don't ignore cancellation — unmounted components with pending requests cause memory leaks and stale state updates

---

## 4. React Query Patterns

### Current Approach (Good)

- **Query key factories** — well-structured with `all`, `list(params)`, `detail(id)` pattern
- **Mutation → invalidation** — mutations invalidate via `queryKey: xxxKeys.all`
- **Feature hooks** encapsulate `useQuery`/`useMutation` + return simplified interface
- **Infinite queries** for notifications

### Problems Identified

1. **No global QueryClient defaults** — every hook must manually set `staleTime`, `retry`, `gcTime`. Missed in one place = aggressive refetching.
2. **No global error handler** — no `QueryCache` / `MutationCache` `onError`. API errors silently disappear unless each component handles them.
3. **Duplicate key roots** — both `features/tours/hooks.ts` and `features/booking/hooks.ts` export `bookingKeys` with root `['bookings']`. Cache collision risk.
4. **staleTime inconsistency** — hotels use `5 * 60_000`, notifications use `30_000`, some queries have no staleTime at all.
5. **Auth check pattern is fragile** — `useAuthStore.getState().authUser` inside hook bodies (notifications) bypasses React's subscription model.

### Improved QueryClient Setup

```typescript
// app/query-client.ts

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isApiError } from '@/lib/api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60_000, // 2 min default — prevents over-fetching
      gcTime: 10 * 60_000, // 10 min garbage collection
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) {
          return false; // Don't retry client errors
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Explicit — users control refetch
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show toast for queries that already had data (background refetch fail)
      if (query.state.data !== undefined) {
        toast.error(isApiError(error) ? error.message : 'Something went wrong');
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Action failed');
    },
  }),
});
```

### Query Key Convention

Every feature **must** use a unique root key. Convention: `[feature-name]`.

```typescript
// features/tours/keys.ts
export const tourKeys = {
  all: ['tours'] as const,
  list: (params?: TourListParams) => [...tourKeys.all, 'list', params] as const,
  detail: (slug: string) => [...tourKeys.all, 'detail', slug] as const,
  catalog: (params?: CatalogParams) =>
    [...tourKeys.all, 'catalog', params] as const,
};

// features/tours/booking-keys.ts — SEPARATE from room bookings
export const tourBookingKeys = {
  all: ['tour-bookings'] as const,
  list: (params?: Filters) => [...tourBookingKeys.all, 'list', params] as const,
  detail: (id: string) => [...tourBookingKeys.all, 'detail', id] as const,
  my: (params?: Filters) => [...tourBookingKeys.all, 'my', params] as const,
};

// features/booking/keys.ts — room bookings only
export const roomBookingKeys = {
  all: ['room-bookings'] as const,
  list: (params?: Filters) => [...roomBookingKeys.all, 'list', params] as const,
  detail: (id: string) => [...roomBookingKeys.all, 'detail', id] as const,
  my: (params?: Filters) => [...roomBookingKeys.all, 'my', params] as const,
};
```

### Auth-Gated Queries

```typescript
// CURRENT (fragile — reads outside React subscription)
const isAuthenticated = !!useAuthStore.getState().authUser;

// IMPROVED (reactive — re-evaluates when auth changes)
const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');

export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 30_000 : false,
  });
}
```

### Optimistic Updates (for mutations that need instant UI feedback)

```typescript
export function useToggleWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: toggleWishlist,
    onMutate: async (tourId) => {
      await qc.cancelQueries({ queryKey: wishlistKeys.all });
      const previous = qc.getQueryData<string[]>(wishlistKeys.ids());

      qc.setQueryData<string[]>(wishlistKeys.ids(), (old = []) =>
        old.includes(tourId)
          ? old.filter((id) => id !== tourId)
          : [...old, tourId],
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(wishlistKeys.ids(), context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
```

### DO

- Set global defaults on `QueryClient` — per-hook overrides for special cases only
- Use `QueryCache.onError` / `MutationCache.onError` as global safety net
- Use reactive Zustand selectors (`useAuthStore(s => ...)`) for `enabled` flags
- Keep query key roots unique per domain — never share across features

### DON'T

- Don't use `useAuthStore.getState()` inside hook bodies — it's not reactive
- Don't skip `staleTime` — React Query defaults to `0` which means every mount refetches
- Don't use the same key root (`['bookings']`) for different entity types
- Don't put `queryClient` creation inside a component — it recreates on every render

---

## 5. State Management (Zustand)

### Current Approach (Minimal and Clean)

Two stores: `useAuthStore` (auth status + user) and `useChatStore` (panel state).
This is correct — Zustand is only for client-side state.

### When to Use Zustand vs React Query

| Signal                                       | Use                |
| -------------------------------------------- | ------------------ |
| Data comes from API                          | React Query        |
| Data is user's current session (token, user) | Zustand            |
| Data is UI state (sidebar, theme, modals)    | Zustand            |
| Data needs caching/revalidation              | React Query        |
| Data is shared across unrelated components   | Zustand            |
| Data is scoped to one component tree         | `useState`/Context |

### Store Pattern

```typescript
// features/auth/store.ts

import { create } from 'zustand';
import type { UserProfile } from './types';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
}

interface AuthActions {
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  status: 'checking',
  user: null,

  setUser: (user) => set({ user, status: 'authenticated' }),
  clearUser: () => set({ user: null, status: 'unauthenticated' }),
  setStatus: (status) => set({ status }),
}));
```

### Zustand Best Practices

```typescript
// GOOD — atomic selector (only re-renders when `status` changes)
const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');

// BAD — destructuring subscribes to entire store
const { status, user } = useAuthStore();

// GOOD — multiple atomic selectors for multiple values
const user = useAuthStore((s) => s.user);
const status = useAuthStore((s) => s.status);

// GOOD — computed selector with shallow comparison for objects
import { useShallow } from 'zustand/react/shallow';

const { user, status } = useAuthStore(
  useShallow((s) => ({ user: s.user, status: s.status })),
);
```

### DO

- Always use atomic selectors — one value per `useStore(s => s.xxx)` call
- Separate state shape from actions in the type definition
- Keep stores small — if it grows past 10 fields, split it
- Colocate the store with its feature

### DON'T

- Don't put server data in Zustand (use React Query)
- Don't destructure the whole store: `const { a, b, c } = useStore()`
- Don't access store imperatively in render: `useStore.getState()` — use the hook
- Don't create middleware (persist, devtools) unless there's a real need

---

## 6. Form Handling

### Current Approach (Mixed)

- Some forms use `zodResolver(schema)` — clean and type-safe
- Other forms use `useForm` with HTML `rules` or no validation at all
- `CustomInput` wraps `Controller` + supports multiple input types via `type` prop

### Problems Identified

1. **Inconsistent validation** — Zod in some forms, `RegisterOptions` in others, nothing in some. No single source of truth.
2. **`CustomInput` is a god component** — handles text, password, date, select, multi-select, checkbox via a `type` prop. This violates SRP and is hard to extend.
3. **Schemas defined inline in page files** — not reusable, not testable.

### Improved Pattern

**Rule: Every form MUST have a Zod schema. No exceptions.**

```
features/auth/
├── schemas.ts          # All Zod schemas for this domain
├── types.ts            # Inferred types from schemas
└── components/
    └── LoginForm.tsx   # Form component using the schema
```

### Schema-First Approach

```typescript
// features/auth/schemas.ts

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(1, 'Name is required'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

// Types inferred from schemas — single source of truth
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
```

### Form Component Pattern

```typescript
// features/auth/components/LoginForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLogin } from '../hooks';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { login, isPending } = useLogin();

  const onSubmit = form.handleSubmit((data) => {
    login(data, {
      onError: (error) => {
        form.setError('root', { message: error.message });
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password field... */}

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" loading={isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
}
```

### DO

- Always use `zodResolver` — never mix with `RegisterOptions` rules
- Infer form types from Zod schemas (`z.infer<typeof schema>`)
- Use shadcn's `Form` + `FormField` instead of custom `Controller` wrappers
- Keep schemas in dedicated `schemas.ts` files — reusable and testable
- Use `form.setError('root', ...)` for server-side errors

### DON'T

- Don't define Zod schemas inline inside component files
- Don't build a god `CustomInput` that handles every input type via a `type` prop — compose instead
- Don't duplicate validation between client and server — schemas are the contract
- Don't use `RegisterOptions` from RHF — Zod is strictly superior for this stack

---

## 7. Error Handling Strategy

### Current Approach

- `ErrorBoundary` wraps every route — catches render errors → reload page
- Axios interceptor normalizes error messages
- `StatusAlert` hook for timed notifications (custom, not a toast library)
- Per-query: some check `error`, some return `null`

### Problems Identified

1. **No global mutation error handler** — if a mutation fails and the component doesn't handle it, the error is silently swallowed.
2. **ErrorBoundary only does full reload** — no retry, no granular recovery.
3. **`StatusAlert` is reinventing toast** — sonner (shadcn-compatible) exists and is better.
4. **No 401 handling** — expired tokens cause raw failures.
5. **No error classification** — network errors, validation errors, and server errors are all treated the same.

### Three-Layer Error Strategy

```
Layer 1: Global Safety Net      → QueryCache/MutationCache onError → toast
Layer 2: Route-Level Boundary   → ErrorBoundary per route → fallback UI
Layer 3: Component-Level        → Query/mutation error → inline UI
```

### Layer 1: Global Error Handler

```typescript
// Already shown in Section 4 — QueryClient setup with toast notifications
// This catches every unhandled query/mutation error
```

### Layer 2: Improved ErrorBoundary

```typescript
// components/feedback/ErrorFallback.tsx

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}
```

Use `react-error-boundary` (the library) instead of hand-rolling — it supports `resetKeys`, `onReset`, `fallbackRender`.

### Layer 3: Component-Level Error Handling

```typescript
// Pattern for query errors in components
function HotelDetail() {
  const { data: hotel, isLoading, error } = useHotelDetailQuery(id);

  if (isLoading) return <HotelDetailSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Could not load hotel"
        description={error.message}
        action={{ label: 'Go back', onClick: () => navigate(-1) }}
      />
    );
  }

  if (!hotel) return <EmptyState title="Hotel not found" />;

  return <HotelDetailContent hotel={hotel} />;
}
```

### 401 Handling with Automatic Retry

```typescript
// lib/api-client.ts — add to response interceptor

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

client.interceptors.response.use(
  (res) => (res.config.rawResponse ? res : res.data?.data),
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { access_token } = await refreshToken();
        authUtils.setAccessToken(access_token);
        failedQueue.forEach(({ resolve }) => resolve(access_token));
        failedQueue = [];
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        authUtils.clearAccessToken();
        useAuthStore.getState().clearUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Standard error normalization (as shown in Section 3)
    return Promise.reject(normalizeError(error));
  },
);
```

### DO

- Use the 3-layer strategy — global toast, route boundary, component inline
- Use `sonner` for toasts — it's shadcn-compatible and battle-tested
- Handle 401 with automatic token refresh + request queue
- Provide actionable error messages — "Try again" button, "Go back" link

### DON'T

- Don't silently swallow errors — every mutation error must reach the user
- Don't use `window.location.reload()` as the only recovery — try resetting state first
- Don't build custom alert/toast systems — use established libraries
- Don't treat network errors and validation errors the same — different UX for each

---

## 8. Loading & Skeleton Patterns

### Current Approach (Good Start)

- `LoadingScreen` — full-page spinner
- `LoadingOverlay` — portal-based overlay for mutations
- Colocated skeletons (`RoomCardSkeleton`, `TourCardSkeleton`)
- `useMinLoading` — prevents flicker

### Problems Identified

1. **No consistent skeleton strategy** — some pages use skeletons, some use `LoadingScreen`, some use nothing.
2. **No standardized empty state** — some pages return `null` for missing data.
3. **`LoadingScreen` is overused** — full-page spinner should only appear on initial app load.

### Loading State Rules

| Scenario                | Pattern                                        |
| ----------------------- | ---------------------------------------------- |
| Initial page load       | Skeleton matching content shape                |
| Background refetch      | Keep stale data visible                        |
| Mutation in progress    | Button `loading` state + disable form          |
| Full page transition    | `Suspense` + `LoadingScreen` (code split only) |
| Infinite scroll loading | Spinner at bottom of list                      |

### Skeleton Strategy

Every list item and detail page **must** have a skeleton variant.

```typescript
// features/hotels/components/HotelCard.tsx
export function HotelCard({ hotel }: { hotel: Hotel }) { /* ... */ }

// features/hotels/components/HotelCardSkeleton.tsx
export function HotelCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
```

### Standardized Empty State

```typescript
// components/feedback/EmptyState.tsx

import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

### Query Result Pattern (Standardized)

```typescript
function HotelListPage() {
  const { data, isLoading, error } = useHotelsQuery(params);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load hotels"
        description={error.message}
        action={{ label: 'Retry', onClick: () => refetch() }}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={Search}
        title="No hotels found"
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
```

### DO

- Match skeleton shape to actual content — same grid, same card dimensions
- Always handle all 4 states: loading, error, empty, success
- Use `useMinLoading` for fast queries to prevent skeleton flash
- Keep stale data visible during background refetches

### DON'T

- Don't use a full-page spinner for content that has a known shape
- Don't return `null` for missing data — always show an EmptyState
- Don't show loading spinners on background refetches — use stale-while-revalidate

---

## 9. Routing & Code Splitting

### Current Approach

- `Loadable` pattern wraps `React.lazy` + `Suspense`
- Route config in `router.tsx` — centralized array
- `ProtectedRoute` + `ErrorBoundary` wrap every route
- Breadcrumbs via `handle.crumb`

### Problems Identified

1. **`createBrowserRouter` recreated on auth change** — `AppRouter` calls `createBrowserRouter` inside `useMemo` keyed to `userRoles`. Every role change destroys and rebuilds the entire router, resetting all route state.
2. **`ProtectedRoute` doesn't protect anything** — no route sets `rolesAllowed`, so every route is effectively public.
3. **`useInitAuth` race condition** — `refresh()` is called without `await`, but `finally` block immediately sets `unauthenticated`, racing with the mutation's `onSuccess`.
4. **No 404 page** — unmatched routes show nothing.
5. **No layout-level route grouping** — `MainLayout` is applied per-page instead of per-route-group.

### Fix: useInitAuth Race Condition

```typescript
// hooks/useInitAuth.ts — FIXED

export function useInitAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const data = await refreshTokenApi();
        if (cancelled) return;
        authUtils.setAccessToken(data.access_token);
        setUser(data.account);
      } catch {
        if (cancelled) return;
        clearUser();
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);
}
```

### Fix: Stable Router

```typescript
// Don't recreate the router on every auth change.
// Instead, use a loader/middleware pattern or handle auth inside ProtectedRoute.

// app/router.tsx
export const router = createBrowserRouter(routeObjects);

// app/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
```

### Route Structure Pattern

```typescript
// app/router.tsx

const router = createBrowserRouter([
  {
    element: <MainLayout />,   // Applied to all public routes
    errorElement: <RootErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tours', element: <TourPage /> },
      { path: 'tours/:slug', element: <TourDetailPage /> },
      { path: 'hotels', element: <HotelListPage /> },
      { path: 'hotels/:id', element: <HotelDetailPage /> },
      // ... public routes
    ],
  },
  {
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
    children: [
      { path: 'dashboard', element: <DashboardOverview /> },
      { path: 'dashboard/profile', element: <ProfilePage /> },
      { path: 'dashboard/bookings', element: <BookingsPage /> },
      // ... protected routes
    ],
  },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```

### DO

- Create the router once, outside of components
- Use route-level `errorElement` instead of wrapping every route in ErrorBoundary
- Group routes by layout — MainLayout wraps public, DashboardLayout wraps protected
- Always include a `*` catch-all route for 404
- Enable `StrictMode`

### DON'T

- Don't call `createBrowserRouter` inside a component — it resets all route state
- Don't `await` mutations inside `useEffect` without cancellation
- Don't skip the 404 page
- Don't disable StrictMode in production

---

## 10. Component Patterns

### Composition Rules

```
Page → Layout + Feature Sections → Feature Components → UI Primitives
```

- **Page**: Thin shell. Fetches route params, calls feature hooks, passes data down.
- **Section**: Domain-specific UI block. Receives data via props or feature hooks.
- **Component**: Reusable within a feature. Card, form, list item.
- **UI Primitive**: shadcn `Button`, `Card`, `Input` — zero business logic.

### Page Pattern

```typescript
// pages/hotel/HotelDetail.tsx — thin page

import { useParams } from 'react-router-dom';
import { useHotelDetailQuery } from '@/features/hotels/hooks';
import { HotelDetailContent } from '@/features/hotels/components/HotelDetailContent';
import { HotelDetailSkeleton } from '@/features/hotels/components/HotelDetailSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, error } = useHotelDetailQuery(id);

  if (isLoading) return <HotelDetailSkeleton />;
  if (error) return <EmptyState title="Failed to load hotel" />;
  if (!hotel) return <EmptyState title="Hotel not found" />;

  return <HotelDetailContent hotel={hotel} />;
}
```

### Props Pattern

```typescript
// GOOD — explicit, readable
interface HotelCardProps {
  hotel: Hotel;
  onBook?: (hotelId: string) => void;
  variant?: 'default' | 'compact';
}

// BAD — implicit, unreadable
interface HotelCardProps {
  data: any;
  onClick?: Function;
  [key: string]: any;
}
```

### Children vs Render Props vs Composition

```typescript
// PREFER: Composition via children
<Card>
  <CardHeader>
    <CardTitle>Hotel Name</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// AVOID: Render props (unless truly needed for data flow)
<Card renderHeader={(data) => <h1>{data.title}</h1>} />

// AVOID: Mega-props that configure everything
<Card
  title="Hotel"
  subtitle="Stars"
  image="/foo.jpg"
  imageAlt="..."
  showFooter
  footerAction="Book"
/>
```

### DO

- Pages are thin — fetch + compose, no business logic
- One component per file, named export matching filename
- Use TypeScript interfaces for props — never `any`
- Colocate feature-specific components inside the feature folder

### DON'T

- Don't put business logic in pages — extract to hooks or feature components
- Don't use `[key: string]: any` in prop interfaces
- Don't use `React.FC` — use plain function declarations
- Don't pass more than 5-6 props — if you need more, pass an object or use composition

---

## 11. TypeScript Patterns

### Type Organization

```
types/               # Cross-cutting, shared types
├── api.ts           # ApiListResponse<T>, PageMeta, Paginate, SortParam
└── commons.ts       # RouteConfig, Language, ComponentSize

features/auth/
└── types.ts         # UserProfile, LoginPayload, AuthStatus

features/hotels/
└── types.ts         # Hotel, HotelOption, GetHotelsParams
```

### Rules

```typescript
// PREFER interfaces for object shapes (extensible)
interface Hotel {
  id: string;
  name: string;
  rating: number;
}

// USE type for unions, intersections, mapped types
type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
type HotelWithRooms = Hotel & { rooms: Room[] };

// ALWAYS use `as const` for constant objects used as enums
export const BookingStatus = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Cancelled: 'cancelled',
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// AVOID TypeScript enums — use const objects instead
// enum BookingStatus { ... }  ← don't do this
```

### Generic Patterns for API

```typescript
// types/api.ts — already good in current codebase, but add a few utilities

export type ApiListResponse<T> = {
  data: T[];
  meta: PageMeta;
};

export type ApiResponse<T> = {
  data: T;
};

// Utility: extract item type from list response
type ExtractItem<T> = T extends ApiListResponse<infer U> ? U : never;
```

### Strict Rules

```typescript
// In tsconfig.json — ensure these are enabled
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false  // can be too strict for forms
  }
}
```

### DO

- Use `interface` for object shapes, `type` for everything else
- Use `as const` objects instead of TypeScript `enum`
- Use `unknown` instead of `any` — force type narrowing
- Keep types close to where they're used — feature types in feature folders

### DON'T

- Don't use `any` — use `unknown` and narrow, or use a specific type
- Don't use TypeScript `enum` — use const objects with `as const`
- Don't create a monolithic `types.ts` with all project types
- Don't export types that are only used within a single file

---

## 12. Caching Strategy

### React Query Cache Configuration

| Data Type        | staleTime | gcTime | refetchOnWindowFocus | refetchInterval |
| ---------------- | --------- | ------ | -------------------- | --------------- |
| Static lists     | 10 min    | 30 min | false                | —               |
| User profile     | 5 min     | 10 min | false                | —               |
| Hotel/tour lists | 2 min     | 10 min | false                | —               |
| Notifications    | 30s       | 5 min  | true                 | 30s             |
| Search results   | 0         | 5 min  | false                | —               |
| Booking details  | 1 min     | 10 min | false                | —               |

### Prefetching for Perceived Performance

```typescript
// Prefetch on hover for detail pages
function TourCard({ tour }: { tour: Tour }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: tourKeys.detail(tour.slug),
      queryFn: () => getTourBySlug(tour.slug),
      staleTime: 5 * 60_000,
    });
  };

  return (
    <Link
      to={`/tours/${tour.slug}`}
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      {/* card content */}
    </Link>
  );
}
```

### Invalidation Rules

| Action               | Invalidation Strategy                                            |
| -------------------- | ---------------------------------------------------------------- |
| Create entity        | Invalidate `xxxKeys.all` (refetch all lists)                     |
| Update entity        | Invalidate `xxxKeys.detail(id)` + `xxxKeys.all`                  |
| Delete entity        | Remove `xxxKeys.detail(id)` + invalidate `xxxKeys.all`           |
| Cross-feature impact | Invalidate both feature keys (e.g., booking → room availability) |

```typescript
export function useDeleteBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: roomBookingKeys.detail(id) });
      qc.invalidateQueries({ queryKey: roomBookingKeys.all });
      // Cross-feature: room availability may have changed
      qc.invalidateQueries({ queryKey: roomKeys.all });
    },
  });
}
```

### DO

- Set `staleTime` based on data volatility — static data gets longer, live data gets shorter
- Prefetch on hover/focus for detail pages
- Use `removeQueries` for deleted entities — don't leave ghost cache entries
- Think about cross-feature cache impacts

### DON'T

- Don't leave `staleTime: 0` (default) — it causes refetch on every mount
- Don't invalidate more than necessary — be surgical with query keys
- Don't forget `gcTime` — default 5 min may be too short for some data

---

## 13. Anti-Patterns & Common Mistakes

### 1. Fetching in useEffect

```typescript
// BAD — manual fetch + state management
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getHotels()
    .then(setHotels)
    .finally(() => setLoading(false));
}, []);

// GOOD — React Query handles everything
const { data: hotels, isLoading } = useHotelsQuery();
```

### 2. Prop Drilling Server Data

```typescript
// BAD — fetching in parent, drilling through 4 levels
<Page>
  <Section hotel={hotel}>
    <Info hotel={hotel}>
      <Rating rating={hotel.rating} />
    </Info>
  </Section>
</Page>

// GOOD — fetch at the level that needs it
function Rating({ hotelId }: { hotelId: string }) {
  const { data: hotel } = useHotelDetailQuery(hotelId);
  // React Query deduplicates — same data, no extra request
}
```

### 3. Mixing Server and Client State

```typescript
// BAD — copying query data into Zustand
const { data } = useHotelsQuery();
useEffect(() => {
  if (data) setHotelsInStore(data); // why?
}, [data]);

// GOOD — React Query IS your server state store
// Access it anywhere with the same query key
```

### 4. God Components

```typescript
// BAD — 500-line component doing everything
function TourDetailPage() {
  // 20 hooks
  // 15 handlers
  // 300 lines of JSX
}

// GOOD — decompose by responsibility
function TourDetailPage() {
  const { slug } = useParams();
  const { data: tour } = useTourDetailQuery(slug);
  if (!tour) return null;

  return (
    <>
      <TourHero tour={tour} />
      <TourInfo tour={tour} />
      <TourBookingForm tourId={tour.id} />
      <TourReviews entityId={tour.id} />
    </>
  );
}
```

### 5. Inline Handlers in JSX

```typescript
// BAD — recreated on every render, breaks memoization
<Button onClick={() => handleDelete(item.id)}>Delete</Button>

// GOOD for lists — use useCallback or extract to a component
function ItemRow({ item, onDelete }: Props) {
  const handleDelete = useCallback(
    () => onDelete(item.id),
    [item.id, onDelete],
  );
  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### 6. Not Handling All States

```typescript
// BAD — optimistic, only handles success
function HotelList() {
  const { data } = useHotelsQuery();
  return data?.map(h => <HotelCard hotel={h} />);
}

// GOOD — handles every possibility
function HotelList() {
  const { data, isLoading, error } = useHotelsQuery();

  if (isLoading) return <HotelListSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState title="No hotels" />;

  return data.map(h => <HotelCard key={h.id} hotel={h} />);
}
```

---

## Quick Reference

### File Naming

| Type        | Convention        | Example             |
| ----------- | ----------------- | ------------------- |
| Component   | PascalCase        | `HotelCard.tsx`     |
| Hook        | camelCase, `use*` | `useHotelsQuery.ts` |
| Utility     | camelCase         | `formatPrice.ts`    |
| Type file   | camelCase         | `types.ts`          |
| Schema file | camelCase         | `schemas.ts`        |
| Constant    | camelCase         | `routes.ts`         |
| Store       | camelCase, `use*` | `useAuthStore.ts`   |

### Import Order (enforce via ESLint)

```typescript
// 1. React / framework
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal aliases (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store';

// 4. Relative imports
import { HotelCard } from './components/HotelCard';
import type { Hotel } from './types';
```

### Component File Template

```typescript
// features/hotels/components/HotelCard.tsx

import type { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  variant?: 'default' | 'compact';
}

export function HotelCard({ hotel, variant = 'default' }: HotelCardProps) {
  // hooks first
  // derived state / computation
  // handlers
  // early returns (loading, error, empty)
  // main render
}
```

### Feature Module Template

```
features/hotels/
├── api.ts              # API functions (getHotels, getHotelById...)
├── hooks.ts            # React Query hooks (useHotelsQuery, useHotelDetailQuery...)
├── keys.ts             # Query key factory (hotelKeys)
├── types.ts            # Domain types (Hotel, HotelOption, GetHotelsParams)
├── schemas.ts          # Zod schemas (hotelSearchSchema, hotelFormSchema)
├── store.ts            # Zustand store (only if needed)
├── index.ts            # Public barrel export
└── components/         # Feature-specific UI
    ├── HotelCard.tsx
    ├── HotelCardSkeleton.tsx
    ├── HotelSearchForm.tsx
    └── HotelDetailContent.tsx
```
