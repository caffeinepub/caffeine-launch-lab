# AIToolsProX

## Current State

The app has a working backend with `createTool`, `getTools`, `updateTool`, `deleteTool`, `getPublicTools`, and `getAllToolsAdmin` methods. Analytics uses localStorage. The backend canister is currently stopped (IC0508), causing all tool operations to fail.

Frontend issues:
- `useActor.ts`: `_initializeAccessControlWithSecret` is NOT wrapped in try/catch inside the `queryFn`. If it throws (e.g. canister stopped, wrong method call), the entire queryFn throws and the actor query returns an error — meaning `actor` is `null` for all writes.
- `useAnonActor.ts`: Module-level cache means a failed creation is never retried without a manual `resetAnonActor()` call. No canister-stopped detection.
- `useQueries.ts`: Error messages are generic — no distinction between IC0508 (canister stopped), auth errors, or network issues.
- `backend.ts`: The `Backend` class has three dead methods (`getCategories`, `createCategory`, `deleteCategory`) that call non-existent actor methods, potentially destabilizing actor calls.
- Error display in `ToolVerwaltung`: Shows generic "Fehler beim Laden der Tools" with no detail.

## Requested Changes (Diff)

### Add
- Canister-stopped detection helper: parse IC0508 from error messages and show specific user-facing message
- Retry logic in `useAnonActor` when canister was recently stopped (exponential backoff already there, keep it)

### Modify
- `useActor.ts`: Wrap `_initializeAccessControlWithSecret` in try/catch; log the error but always return the actor. This matches the fix that was applied in previous sessions but may have been reverted.
- `useAnonActor.ts`: Remove module-level cache (or invalidate it on error), so a failed actor creation is retried on next hook call. Add specific console error for IC0508.
- `useQueries.ts`: In `useAllToolsAdmin` and `usePublicTools`, catch IC0508 specifically and throw a human-readable error. In `ToolVerwaltung` error display, show the actual error message when available.
- `backend.ts`: Remove `getCategories`, `createCategory`, `deleteCategory` methods that call non-existent backend methods.
- `Admin.tsx` (ToolVerwaltung component): Display specific error message from the query error object instead of generic text.

### Remove
- Dead actor methods in `backend.ts` that don't exist in the Motoko canister

## Implementation Plan

1. Fix `useActor.ts` — wrap `_initializeAccessControlWithSecret` in try/catch, always return actor
2. Fix `useAnonActor.ts` — remove broken module-level cache that prevents retry; let react-query handle caching
3. Fix `useQueries.ts` — add IC0508 error detection helper, improve error messages for tool loading
4. Fix `backend.ts` — remove dead methods
5. Fix `Admin.tsx` ToolVerwaltung — show specific error details
6. Deploy (restarts the stopped canister)
