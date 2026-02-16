# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Countlr is a React Native mobile app (Expo SDK 53) for tracking event occurrences over time. Users create events and increment counts, with timeline views by timeframe (hour/day/week/month/year).

## Commands

```bash
yarn start          # Start Expo dev server
yarn ios            # Run on iOS simulator
yarn android        # Run on Android emulator
yarn web            # Run in browser
eas build           # Build with EAS (see eas.json for profiles)
```

No test or lint commands are configured. Prettier (3.6.2) is installed but has no script.

## Architecture

**Stack:** React Native 0.79 + React 19, TypeScript (strict), Expo Router (file-based routing), Tamagui UI, Supabase (auth + Postgres), TanStack React Query.

**Package manager:** Yarn

### Routing (`app/`)

File-based routing via Expo Router. Protected routes use `Stack.Protected` in `app/_layout.tsx`:
- **Public:** `/sign-in`, `/sign-up`
- **Protected:** `/` (events list), `/account`, `/event/[id]` (event detail with timeline)

### Data Layer (`src/lib/`)

- `supabase.ts` — Supabase client with SecureStore for token persistence. Environment vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `auth-hooks.ts` — `useAuth()`, `useSignIn()`, `useSignUp()`, `useSignOut()`
- `event-hooks.ts` — React Query hooks (`useEvents`, `useEvent`, `useIncrementEvent`, `useCreateEvent`, `useEventOccurrences`). Uses optimistic updates for increments. Query keys: `["events"]`, `["event", id]`, `["event-occurrences", id, timeframe]`.

### Components (`src/components/`)

Tamagui components preferred over raw React Native primitives. `EventCard` is the main reusable component.

### Database

Two tables: `events` (id, name, created_at) and event occurrences (id, event_id, created_at). Aggregated via Supabase RPC function `get_events_with_counts`.

### Styling

Tamagui with default v4 config (`tamagui.config.ts`). Babel plugin enabled for production style extraction only.
