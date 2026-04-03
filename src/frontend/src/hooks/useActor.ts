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
        // Return anonymous actor if not authenticated
        const anonActor = await createActorWithConfig();
        console.log("[useActor] Anonymous actor created (not logged in)");
        return anonActor;
      }

      const actorOptions = {
        agentOptions: {
          identity,
        },
      };

      const actor = await createActorWithConfig(actorOptions);
      console.log(
        "[useActor] Authenticated actor created for principal:",
        identity.getPrincipal().toString(),
      );

      // CRITICAL: wrap _initializeAccessControlWithSecret in try/catch.
      // If this call fails (canister stopped, network error, etc.), we must still
      // return the actor. Throwing here would leave actor=null permanently
      // (staleTime: Infinity means no retry), causing all write operations to fail
      // with "Not authenticated".
      try {
        const adminToken = getSecretParameter("caffeineAdminToken") || "";
        await actor._initializeAccessControlWithSecret(adminToken);
        console.log("[useActor] _initializeAccessControlWithSecret succeeded");
      } catch (e) {
        // Log but do NOT rethrow. The actor is still valid for all tool operations.
        // createTool/updateTool/deleteTool do NOT require access control initialization.
        console.warn(
          "[useActor] _initializeAccessControlWithSecret failed (non-fatal):",
          String(e),
        );
      }

      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
    retry: (failureCount, error) => {
      // Retry up to 2 times, but not for auth errors
      const msg = String(error);
      if (
        msg.includes("Not authenticated") ||
        msg.includes("CANISTER_ID_BACKEND is not set")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // When the actor changes, invalidate dependent queries
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
