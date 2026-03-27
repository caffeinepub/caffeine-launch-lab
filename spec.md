# Caffeine Launch Lab – Tool System

## Current State
App has backend with tool methods (createTool, updateTool, deleteTool, getPublicTools, getAllToolsAdmin) but backend.did.js IDL is missing these methods. This causes all tool calls to silently hang. The Backend class in backend.ts has the methods manually added but they delegate to actor methods that don't exist in the IDL.

## Requested Changes (Diff)

### Add
- Tool IDL types and methods to backend.did.js
- useAnonActor hook (anonymous actor for reads, bypasses auth timing)
- Tool query/mutation hooks in useQueries.ts
- ToolVerwaltung tab in Admin.tsx (simple list + modal form)
- Tools section in Landing.tsx (isPublic tools, sorted by reihenfolge)

### Modify
- backend.did.js: add Tool, CreateToolArgs IDL types + 5 tool methods to idlService
- useActor.ts: wrap _initializeAccessControlWithSecret in try/catch
- useQueries.ts: add tool hooks
- Admin.tsx: add Tool-Verwaltung tab
- Landing.tsx: add tools section
- backend/main.mo: remove postupgrade seed logic (user wants no seed data)

### Remove
- postupgrade seed data in main.mo
- Any existing /tools page route (tools only on homepage)

## Implementation Plan
1. Fix backend.did.js to include tool IDL types and methods
2. Add useAnonActor.ts hook (no auth, no _initializeAccessControlWithSecret)
3. Add tool hooks to useQueries.ts using anonActor for reads, actor for writes
4. Add ToolVerwaltung tab to Admin.tsx with simple list and create/edit/delete modal
5. Add tools section to Landing.tsx showing isPublic tools sorted by reihenfolge
6. Validate and build
