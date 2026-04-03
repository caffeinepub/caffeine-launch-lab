# AIToolsProX – Analytics (localStorage)

## Current State

The Admin Dashboard already has an "Analytics" tab (`tab === "analytics"` in `Admin.tsx`). It currently uses `useVisitorStats()` which calls the backend canister method `getVisitorStats()` and `trackVisit()`. The backend-based tracking has been unreliable (canister stopped, network errors, 0 values displayed). The Landing page calls `useTrackVisit()` which fires a backend mutation on every homepage visit.

## Requested Changes (Diff)

### Add
- A new `useLocalAnalytics` hook in `src/frontend/src/hooks/useLocalAnalytics.ts` that:
  - Tracks all data in `localStorage` only (key: `aitoolsprox_analytics`)
  - On each page load: increments `pageViews` total counter
  - Identifies new vs returning visitors via a `visitorId` key in localStorage
  - Increments `totalVisitors` only if no `visitorId` exists yet (new visitor)
  - Sets `visitorId` on first visit
  - Stores daily visit counts keyed by ISO date string (YYYY-MM-DD) for the last 7 days
  - Exposes: `totalVisitors`, `visitorsToday`, `visitorsThisWeek`, `pageViews`, `returningVisitors`
  - Returns `recordVisit()` function to be called on page load

### Modify
- `Landing.tsx`: Replace `useTrackVisit` (backend) with `useLocalAnalytics().recordVisit()` call on mount
- `Admin.tsx` Analytics tab: Replace `visitorStatsData` (backend) with data from `useLocalAnalytics()`
  - Show 4 stat cards: Total Visitors, Visitors Today, This Week (last 7 days), Page Views
  - Keep the bar chart using daily data from localStorage
  - Keep the existing Content-Analytics and history sections unchanged

### Remove
- Backend `useVisitorStats` and `useTrackVisit` calls from Landing.tsx and Admin.tsx
- No backend changes needed

## Implementation Plan

1. Create `src/frontend/src/hooks/useLocalAnalytics.ts`:
   - Read/write a single JSON object in localStorage key `aitoolsprox_analytics`
   - Structure: `{ visitorId: string|null, totalVisitors: number, pageViews: number, dailyVisits: { [dateKey: string]: number }, returningVisitors: number }`
   - `recordVisit()`: called once per page load
     - Always increment `pageViews`
     - If no `visitorId` → new visitor: set `visitorId` (uuid-like timestamp), increment `totalVisitors`
     - If `visitorId` exists → returning visitor: increment `returningVisitors`
     - Increment today's daily count
     - Prune daily entries older than 30 days
   - Computed getters: `visitorsToday` (today's daily count), `visitorsThisWeek` (sum of last 7 days)

2. Update `Landing.tsx`:
   - Remove `useTrackVisit` import and usage
   - Import and call `useLocalAnalytics().recordVisit()` on mount (useEffect, once)

3. Update `Admin.tsx` Analytics tab:
   - Remove `useVisitorStats` import and usage
   - Import `useLocalAnalytics`
   - Replace the 4 stat cards with: Total Visitors, Visitors Today, This Week, Page Views
   - Update bar chart data source from `visitorStatsData.dailyData` to local analytics daily data
   - Keep Content-Analytics section unchanged
