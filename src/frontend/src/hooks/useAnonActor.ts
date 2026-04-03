import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

// Anonymous actor for public/read-only calls.
// No _initializeAccessControlWithSecret, no auth dependency.
// Both admin reads and public reads use this to avoid auth timing issues.
//
// NOTE: Actor CREATION never throws IC0508 -- that error only occurs at call time
// (when getPublicTools/getAllToolsAdmin is actually called). The IC0508 check
// belongs in useQueries.ts where the actual canister call happens.

export function useAnonActor() {
  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      const actor = await createActorWithConfig();
      console.log("[useAnonActor] Anonymous actor created successfully");
      return actor;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
