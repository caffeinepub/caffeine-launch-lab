import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig, loadConfig } from "../config";

// Anonymous actor for public/read-only calls.
// staleTime: 0 — always recreate after invalidation to recover from canister restarts.
// No module-level cache — config.ts now always fetches env.json fresh.

export function useAnonActor() {
  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      // Log the canister ID this actor will connect to
      try {
        const cfg = await loadConfig();
        console.log(
          `[useAnonActor] Anonym Actor erstellt | Canister ID: ${cfg.backend_canister_id} | Host: ${cfg.backend_host ?? "mainnet"}`,
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

  const queryClient = useQueryClient();

  return {
    anonActor: query.data || null,
    isLoading: query.isLoading,
    resetAnonActor: () => {
      console.log("[useAnonActor] Actor wird zurückgesetzt (force refetch)");
      queryClient.invalidateQueries({ queryKey: ["anonActor"] });
    },
  };
}
