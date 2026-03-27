import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContentRecord, Stats } from "../backend";
import { useActor } from "./useActor";

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

// ---- Tool hooks ----

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

import { useAnonActor } from "./useAnonActor";

export function usePublicTools() {
  const { anonActor } = useAnonActor();
  return useQuery<Tool[]>({
    queryKey: ["publicTools"],
    queryFn: async () => {
      if (!anonActor) return [];
      const result = await (anonActor as any).getPublicTools();
      return Array.isArray(result) ? result : [];
    },
    enabled: !!anonActor,
  });
}

export function useAllToolsAdmin() {
  const { anonActor } = useAnonActor();
  return useQuery<Tool[]>({
    queryKey: ["allToolsAdmin"],
    queryFn: async () => {
      if (!anonActor) return [];
      const result = await (anonActor as any).getAllToolsAdmin();
      return Array.isArray(result) ? result : [];
    },
    enabled: !!anonActor,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useCreateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateToolArgs) => {
      if (!actor) throw new Error("Not authenticated");
      return (actor as any).createTool(args);
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
      if (!actor) throw new Error("Not authenticated");
      return (actor as any).updateTool(id, args);
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
      if (!actor) throw new Error("Not authenticated");
      return (actor as any).deleteTool(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["publicTools"] });
    },
  });
}
