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
        agentOptions: {
          identity,
        },
      };

      const actor = await createActorWithConfig(actorOptions);

      // IMPORTANT: _initializeAccessControlWithSecret MUST be in try/catch.
      // If this call throws (canister temporarily busy, restarting after deploy,
      // or any other error), without try/catch the entire queryFn throws and
      // the actor is never returned — leaving actor=null and causing every
      // subsequent createTool/updateTool/deleteTool to fail with "Not authenticated".
      // We always return the actor regardless of whether this init call succeeds.
      try {
        const adminToken = getSecretParameter("caffeineAdminToken") || "";
        await actor._initializeAccessControlWithSecret(adminToken);
      } catch (initErr) {
        console.warn(
          "[useActor] _initializeAccessControlWithSecret failed (non-fatal):",
          initErr,
        );
        // Continue — the actor is still valid for authenticated calls.
        // createTool/updateTool/deleteTool check caller.isAnonymous() on the
        // backend side, which will succeed as long as the user is logged in.
      }

      return actor;
    },
    // staleTime: 0 means after invalidation the actor is always recreated.
    // This ensures a post-deploy canister restart doesn't leave a stale actor.
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
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
