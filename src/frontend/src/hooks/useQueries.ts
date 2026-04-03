import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContentRecord, Stats } from "../backend";
import { useActor } from "./useActor";
import { useAnonActor } from "./useAnonActor";

export function useMyHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentRecord[]>({
    queryKey: ["myHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ContentRecord[]>({
    queryKey: ["allHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { totalCount: BigInt(0), recentCount: BigInt(0) };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      topic: string;
      hooks: string[];
      script: string;
      canvaTips: string;
      caption: string;
      hashtags: string[];
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveContent(
        params.topic,
        params.hooks,
        params.script,
        params.canvaTips,
        params.caption,
        params.hashtags,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHistory"] });
      queryClient.invalidateQueries({ queryKey: ["allHistory"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHistory"] });
      queryClient.invalidateQueries({ queryKey: ["allHistory"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useBulkDelete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.bulkDelete(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHistory"] });
      queryClient.invalidateQueries({ queryKey: ["allHistory"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Tool types ----

export interface Tool {
  id: bigint;
  emoji: string;
  name: string;
  kurzbeschreibung: string;
  zielgruppe: string;
  affiliateLink: [] | [string];
  fallbackLink: string;
  reihenfolge: bigint;
  isPublic: boolean;
}

export interface CreateToolArgs {
  emoji: string;
  name: string;
  kurzbeschreibung: string;
  zielgruppe: string;
  affiliateLink: [] | [string];
  fallbackLink: string;
  reihenfolge: bigint;
  isPublic: boolean;
}

// Normalize a raw tool record from the canister.
// Handles potential field name mismatches between old and new canister versions.
function normalizeTool(raw: Record<string, unknown>): Tool {
  return {
    id: (raw.id as bigint) ?? BigInt(0),
    emoji: (raw.emoji as string) ?? "",
    name: (raw.name as string) ?? "",
    kurzbeschreibung: (raw.kurzbeschreibung as string) ?? "",
    zielgruppe: (raw.zielgruppe as string) ?? "",
    affiliateLink: (raw.affiliateLink as [] | [string]) ?? [],
    fallbackLink: (raw.fallbackLink as string) ?? (raw.link as string) ?? "",
    reihenfolge: (raw.reihenfolge as bigint) ?? BigInt(0),
    isPublic: (raw.isPublic as boolean) ?? false,
  };
}

export function usePublicTools() {
  const { anonActor } = useAnonActor();
  return useQuery<Tool[]>({
    queryKey: ["publicTools"],
    queryFn: async () => {
      if (!anonActor) {
        console.warn("[usePublicTools] anonActor not ready");
        return [];
      }
      try {
        const result = await (anonActor as any).getPublicTools();
        if (!Array.isArray(result)) {
          console.error("[usePublicTools] unexpected result:", result);
          return [];
        }
        return result.map(normalizeTool);
      } catch (e) {
        console.error(
          "[usePublicTools] Fehler beim Laden der öffentlichen Tools:",
          e,
        );
        throw e;
      }
    },
    enabled: !!anonActor,
    retry: 2,
    retryDelay: 1500,
  });
}

export function useAllToolsAdmin() {
  const { anonActor } = useAnonActor();
  return useQuery<Tool[]>({
    queryKey: ["allToolsAdmin"],
    queryFn: async () => {
      if (!anonActor) {
        console.warn("[useAllToolsAdmin] anonActor not ready, waiting...");
        return [];
      }
      try {
        const result = await (anonActor as any).getAllToolsAdmin();
        if (!Array.isArray(result)) {
          console.error(
            "[useAllToolsAdmin] unerwartetes Ergebnis vom Backend:",
            result,
          );
          throw new Error("Ungültiges Ergebnis vom Backend");
        }
        console.log(`[useAllToolsAdmin] ${result.length} Tools geladen`);
        return result.map(normalizeTool);
      } catch (e) {
        console.error("[useAllToolsAdmin] Fehler beim Laden der Tools:", e);
        throw e;
      }
    },
    enabled: !!anonActor,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useCreateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateToolArgs) => {
      if (!actor) throw new Error("Not authenticated – bitte neu einloggen");
      try {
        const result = await (actor as any).createTool(args);
        console.log("[useCreateTool] Tool erstellt, ID:", result);
        return result;
      } catch (e) {
        console.error("[useCreateTool] Fehler:", e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publicTools"] });
    },
  });
}

export function useUpdateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, args }: { id: bigint; args: CreateToolArgs }) => {
      if (!actor) throw new Error("Not authenticated – bitte neu einloggen");
      try {
        const result = await (actor as any).updateTool(id, args);
        console.log("[useUpdateTool] Tool aktualisiert:", String(id), result);
        return result;
      } catch (e) {
        console.error("[useUpdateTool] Fehler:", e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publicTools"] });
    },
  });
}

export function useDeleteTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated – bitte neu einloggen");
      try {
        const result = await (actor as any).deleteTool(id);
        console.log("[useDeleteTool] Tool gelöscht:", String(id), result);
        return result;
      } catch (e) {
        console.error("[useDeleteTool] Fehler:", e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publicTools"] });
    },
  });
}

// ---- Visitor tracking hooks ----

export interface VisitorStats {
  totalVisits: bigint;
  dailyData: Array<[string, bigint]>;
}

export function useVisitorStats() {
  const { anonActor } = useAnonActor();
  return useQuery<VisitorStats>({
    queryKey: ["visitorStats"],
    queryFn: async () => {
      if (!anonActor) return { totalVisits: BigInt(0), dailyData: [] };
      return (anonActor as any).getVisitorStats();
    },
    enabled: !!anonActor,
    staleTime: 30_000,
  });
}

export function useTrackVisit() {
  const { anonActor } = useAnonActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dayKey: string) => {
      if (!anonActor) return;
      await (anonActor as any).trackVisit(dayKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitorStats"] });
    },
  });
}
