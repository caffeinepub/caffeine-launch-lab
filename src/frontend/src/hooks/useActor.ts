import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
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

      if (!isAuthenticated) {
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: { identity },
      };

      const actor = await createActorWithConfig(actorOptions);

      // CRITICAL: Always wrap _initializeAccessControlWithSecret in try/catch.
      // If this call fails (canister busy after deploy, method error, etc.),
      // we still return a valid actor — otherwise createTool / updateTool
      // would always fail with "Not authenticated" because actor stayed null.
      try {
        const adminToken = getSecretParameter("caffeineAdminToken") || "";
        await actor._initializeAccessControlWithSecret(adminToken);
      } catch (initErr) {
        console.warn(
          "[useActor] _initializeAccessControlWithSecret fehlgeschlagen (ignoriert, actor wird trotzdem zurückgegeben):",
          initErr,
        );
      }

      console.log(
        "[useActor] Authenticated actor erstellt für principal:",
        identity.getPrincipal().toString(),
      );
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
  });

  // When the actor changes, invalidate dependent queries so tools reload.
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
      queryClient.refetchQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
