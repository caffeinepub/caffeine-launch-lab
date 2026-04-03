import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

// Anonymous actor for public/read-only calls.
// No _initializeAccessControlWithSecret, no auth dependency.
// Both admin reads and public reads use this to avoid auth timing issues.
// NOTE: We do NOT use a module-level cache here because a cached failed actor
// would never be retried. React Query handles caching and retries correctly.

export function useAnonActor() {
  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      try {
        const actor = await createActorWithConfig();
        return actor;
      } catch (e) {
        const errMsg = String(e);
        if (errMsg.includes("IC0508") || errMsg.includes("is stopped")) {
          console.error(
            "[useAnonActor] Backend canister is stopped (IC0508). Redeploy required.",
            e,
          );
          throw new Error(
            "Backend nicht erreichbar – Canister gestoppt (IC0508). Bitte warte kurz und lade die Seite neu.",
          );
        }
        console.error(
          "[useAnonActor] Fehler beim Erstellen des anonymen Actors:",
          e,
        );
        throw e;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes – reuse actor, but allow refresh
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const queryClient = useQueryClient();

  return {
    anonActor: query.data || null,
    isLoading: query.isLoading,
    // Call this to force re-creation of the anonymous actor (e.g. after canister restart)
    resetAnonActor: () => {
      queryClient.invalidateQueries({ queryKey: ["anonActor"] });
    },
  };
}
