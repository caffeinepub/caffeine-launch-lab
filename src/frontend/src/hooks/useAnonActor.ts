import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

// Anonymous actor for public/read-only calls.
// No _initializeAccessControlWithSecret, no auth dependency.
// Both admin reads and public reads use this to avoid auth timing issues.
//
// IMPORTANT: staleTime is intentionally low (0) so that after a canister
// restart/redeploy the actor is always recreated fresh. The previous 5-minute
// staleTime caused the broken actor to be reused for 5 minutes after restart.
//
// Actor creation itself never throws IC0508. That error only occurs at call
// time (when getPublicTools/getAllToolsAdmin is called). IC0508 handling
// belongs in useQueries.ts where the actual canister calls happen.

export function useAnonActor() {
  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      const actor = await createActorWithConfig();
      console.log("[useAnonActor] Anonymous actor created successfully");
      return actor;
    },
    // staleTime: 0 = always recreate after invalidation, ensuring post-restart recovery
    staleTime: 0,
    gcTime: 60 * 1000, // keep in cache for 1 minute
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const queryClient = useQueryClient();

  return {
    anonActor: query.data || null,
    isLoading: query.isLoading,
    // Call this to force re-creation of the anonymous actor (e.g. after canister restart)
    resetAnonActor: () => {
      console.log("[useAnonActor] Resetting anonymous actor (force refetch)");
      queryClient.invalidateQueries({ queryKey: ["anonActor"] });
    },
  };
}
