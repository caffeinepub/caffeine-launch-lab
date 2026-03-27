import { useQuery } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

// Anonymous actor for public/read-only calls.
// No _initializeAccessControlWithSecret, no auth dependency.
// Both admin reads and public reads use this to avoid auth timing issues.
let cachedAnonActor: backendInterface | null = null;

export function useAnonActor() {
  const query = useQuery<backendInterface>({
    queryKey: ["anonActor"],
    queryFn: async () => {
      if (cachedAnonActor) return cachedAnonActor;
      const actor = await createActorWithConfig();
      cachedAnonActor = actor;
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
  return { anonActor: query.data || null };
}
