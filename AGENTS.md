# AGENTS.md

This file guides coding agents working in this repository.

## Project Summary

Countlr is an Expo Router React Native app for tracking event occurrences over time.

- Runtime: Expo SDK 53, React Native 0.79, React 19
- Language: TypeScript (`strict: true`)
- UI: Tamagui
- Data/auth: Supabase
- Server state: TanStack React Query
- Package manager: Yarn

## Runbook

Use these commands from the repo root:

```bash
yarn start      # Expo dev server
yarn ios        # iOS simulator
yarn android    # Android emulator
yarn web        # Browser
eas build       # EAS build (profiles in eas.json)
```

There are currently no configured lint/test scripts in `package.json`.
Prettier is installed (`3.6.2`) but no script is configured.

## Environment

Supabase is configured in `src/lib/supabase.ts` and requires:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Auth session persistence uses:

- Native: `expo-secure-store`
- Web: `localStorage`

## App Structure

### Routing (`app/`)

File-based routing with Expo Router:

- `/sign-in` and `/sign-up` are public
- `/` (event list), `/account`, and `/event/[id]` are protected

Route protection is implemented in `app/_layout.tsx` using `Stack.Protected` and `useAuth()`.

### Data Layer (`src/lib/`)

- `supabase.ts`: client + shared interfaces (`Event`, `EventOccurrence`, `EventWithCount`)
- `auth-hooks.ts`: `useAuth`, `useSignIn`, `useSignUp`, `useSignOut`
- `event-hooks.ts`:
  - `useEvents(enabled?)`
  - `useEvent(eventId, enabled?)`
  - `useEventOccurrences(eventId, timeframe, enabled?)`
  - `useIncrementEvent()` with optimistic updates + rollback
  - `useCreateEvent()`

React Query keys used:

- `["events"]`
- `["event", eventId]`
- `["event-occurrences", eventId, timeframe]`

### UI Components (`src/components/`)

- `EventCard.tsx`
- `CreateEventModal.tsx`
- `CreateEventHeaderButton.tsx` (currently not wired into screens)

Prefer Tamagui components for layout/styling; use React Native primitives where platform APIs are required (e.g., `Modal`, `TouchableOpacity`).
Tamagui uses default v4 config via `tamagui.config.ts`, and Babel extraction is disabled in development and enabled outside development.

## Database Expectations

The app expects Supabase tables and RPC:

- `events` (`id`, `name`, `created_at`)
- `event_occurrences` (`id`, `event_id`, `created_at`)
- RPC function `get_events_with_counts` used by `useEvents`

Keep client code aligned with these schema expectations when changing data access.

## Conventions for Agents

- Make small, focused edits; avoid unrelated refactors.
- Preserve existing query key names unless intentionally migrating cache behavior.
- If changing mutations, keep optimistic update/rollback behavior coherent.
- Keep route guards intact: protected screens should remain inaccessible when unauthenticated.
- Follow existing formatting style in touched files (mixed semicolon style exists; do not mass-reformat).

## Validation Checklist

After meaningful changes, validate:

1. App boots with `yarn start`.
2. Sign-in/sign-up flow still routes correctly.
3. Event list loads and increment updates count immediately.
4. Event detail timeline loads for all timeframe filters.
5. Account screen sign-out returns to `/sign-in`.
