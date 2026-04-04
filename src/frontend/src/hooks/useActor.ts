import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig, loadConfig } from "../config";
import { getSecretParameter } from "../utils/urlParams";
import { useInternetIdentity } from "./useInternetIdentity";

const ACTOR_QUERY_KEY = "actor";
export function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      // Log which canister ID the actor will use
      try {
        const cfg = await loadConfig();
        console.log(
          `[useActor] Erstelle Actor mit Canister ID: ${cfg.backend_canister_id} | Auth: ${isAuthenticated}`,
        );
      } catch (e) {
        console.warn("[useActor] Konnte Canister-ID nicht lesen:", e);
      }

      if (!isAuthenticated) {
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity,
        },
      };

      const actor = await createActorWithConfig(actorOptions);

      // CRITICAL: Always wrap in try/catch.
      // If _initializeAccessControlWithSecret throws (e.g. canister busy after
      // restart), we must still return the actor. Without try/catch the entire
      // queryFn throws, actor stays null, and every createTool call fails with
      // "Not authenticated".
      const adminToken = getSecretParameter("caffeineAdminToken") || "";
      try {
        await actor._initializeAccessControlWithSecret(adminToken);
        console.log(
          "[useActor] _initializeAccessControlWithSecret erfolgreich",
        );
      } catch (initErr) {
        console.warn(
          "[useActor] _initializeAccessControlWithSecret fehlgeschlagen (nicht kritisch, Actor wird trotzdem zurückgegeben):",
          initErr,
        );
      }

      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
  });

  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        },
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        },
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
