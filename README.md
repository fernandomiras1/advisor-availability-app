# Advisor Listings - React + Vite + TypeScript

Production-quality advisor listings challenge with dynamic availability updates, pagination/infinite modes, and a testing stack suitable for CI.

## Project Overview

- Fetches advisors and renders call/chat availability actions.
- Uses TanStack Query for server-state management.
- Updates visible advisors availability every 30 seconds.
- Supports:
  - Pagination (local pagination)
  - Infinite Scroll (`@tanstack/react-virtual`)
- Includes unit tests (Vitest/RTL) and E2E tests (Playwright).

## Tech Stack

- React 19
- Vite
- TypeScript (strict)
- TanStack Query
- TanStack Virtual
- MUI
- Vitest + React Testing Library
- Playwright
- ESLint + Prettier

## Getting Started

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Tests

```bash
# Unit
npm run test -- --run

# E2E
npx playwright install
npm run test:e2e
```

### Lint/Format

```bash
npm run lint
npm run format
```

## Environment Variables

Create `.env` (or configure in your deployment environment):

```bash
VITE_ADVISORS_USE_MOCK=true
```

- `true`: always use local mock data.
- `false`: try live endpoints first, with fallback behavior handled in service layer.

## Architecture Notes

- API layer is isolated in `src/features/advisors/services`.
- UI is split into small reusable components (`AdvisorCard`, `AdvisorActions`, list variants).
- Polling updates cache with `queryClient.setQueryData` (no full list refetch).
- Avoids duplicating query data into ad-hoc local state.

## Production Readiness Checklist

- Reliability
  - Centralize API error taxonomy and user-facing error mapping.
  - Add retry/backoff policies by endpoint criticality.
  - Add circuit-breaker/fallback toggles via feature flags.
- Observability
  - Add Sentry (or equivalent) for runtime errors.
  - Add telemetry for polling success/failure/latency.
  - Add dashboards/alerts for API degradation.
- Security
  - Configure CSP and security headers in hosting layer.
  - Validate/sanitize external payloads before rendering.
- Performance
  - Add web-vitals monitoring.
  - Optimize avatar loading strategy (sizes/lazy-loading/CDN).
  - Keep virtualization thresholds configurable.
- Accessibility
  - Add automated a11y checks (`axe`) in CI.
  - Add keyboard navigation regression tests.
- Delivery
  - CI gates: `lint`, `test`, `build`, `test:e2e`.
  - Add dependency vulnerability scan and lockfile policy.

### API Contract Hardening

- Add runtime schema validation (e.g. Zod) for API payloads.
- Add contract tests against expected response shapes.
- Version API adapters for backward compatibility.

### UX Improvements

- Add “last updated” timestamp for availability.
- Add subtle update animation for changed availability.
- Add richer empty/error recovery actions.

## Optional Advanced Scaling: SharedWorker + Broadcast

If many tabs are open, each tab polling independently increases load.  
A production optimization path:

1. Move polling into a `SharedWorker`.
2. Keep one poller per browser profile.
3. Broadcast availability updates with `BroadcastChannel`.
4. Each tab applies updates to TanStack cache.

Benefits:

- Less duplicated network traffic.
- Better multi-tab consistency.
- Reduced CPU/network usage.

Suggested message shape:

```ts
type AvailabilityBroadcastMessage = {
  type: "availability:update";
  advisorId: number;
  callAvailable: boolean;
  chatAvailable: boolean;
  updatedAt: string;
};
```

Suggested rollout:

1. Add feature flag `VITE_USE_SHARED_WORKER_POLLING`.
2. Keep current in-tab polling as fallback.
3. Add E2E scenario validating sync across two tabs.
