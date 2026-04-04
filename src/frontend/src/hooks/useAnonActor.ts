import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig, loadConfig } from "../config";

// Anonymous actor for public/read-only calls.
//
// Key design decisions to survive deployments:
// - NO module-level cache. config.ts always fetches env.json fresh (no-store).
// - staleTime: 0 — force recreation on any invalidation, e.g. after IC0508.
// - gcTime: 60s — don't hold a broken actor in cache too long.
// - retry: 3 with exponential backoff.

export function useAnonActor() {
  const queryClient = useQueryClient();

  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      try {
        const cfg = await loadConfig();
        console.log(
          `[useAnonActor] Erstelle anonymen Actor | Canister: ${cfg.backend_canister_id} | Host: ${cfg.backend_host ?? "mainnet"}`,
        );
      } catch (e) {
        console.warn("[useAnonActor] Konnte Canister-ID nicht lesen:", e);
      }
      const actor = await createActorWithConfig();
      return actor;
    },
    staleTime: 0,
    gcTime: 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return {
    anonActor: query.data || null,
    isLoading: query.isLoading,
    resetAnonActor: () => {
      console.log("[useAnonActor] Actor wird zurückgesetzt – force refetch");
      queryClient.removeQueries({ queryKey: ["anonActor"] });
      queryClient.invalidateQueries({ queryKey: ["anonActor"] });
    },
  };
}
