import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContentRecord, Stats } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "./useActor";
import { useAnonActor } from "./useAnonActor";

// ---- Error helpers ----

function isCanisterStopped(e: unknown): boolean {
  const msg = String(e);
  return (
    msg.includes("IC0508") ||
    msg.includes("is stopped") ||
    msg.includes("Canister is stopped")
  );
}

function friendlyError(e: unknown, context: string): string {
  if (isCanisterStopped(e)) {
    return "Backend nicht verfügbar (Canister gestoppt). Bitte lade die Seite in 30 Sekunden neu.";
  }
  const msg = String(e);
  if (msg.includes("Not authenticated")) {
    return "Nicht angemeldet – bitte neu einloggen.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Netzwerkfehler – bitte Internetverbindung prüfen.";
  }
  return `Fehler in ${context}: ${msg}`;
}

async function logCanisterId(context: string) {
  try {
    const cfg = await loadConfig();
    console.log(
      `[${context}] Lese von Canister ID: ${cfg.backend_canister_id}`,
    );
  } catch {
    // ignore
  }
}

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
  const name = (raw.name as string) || (raw.title as string) || "";
  const kurzbeschreibung =
    (raw.kurzbeschreibung as string) || (raw.description as string) || "";
  const fallbackLink =
    (raw.fallbackLink as string) ||
    (raw.link as string) ||
    (raw.fallback as string) ||
    "";
  const isPublic =
    raw.isPublic !== undefined
      ? (raw.isPublic as boolean)
      : raw.visible !== undefined
        ? (raw.visible as boolean)
        : false;

  return {
    id: (raw.id as bigint) ?? BigInt(0),
    emoji: (raw.emoji as string) ?? "",
    name,
    kurzbeschreibung,
    zielgruppe: (raw.zielgruppe as string) ?? "",
    affiliateLink:
      (raw.affiliateLink as [] | [string]) ??
      (raw.link !== undefined ? [raw.link as string] : []),
    fallbackLink,
    reihenfolge: (raw.reihenfolge as bigint) ?? BigInt(0),
    isPublic,
  };
}

export function usePublicTools() {
  const { anonActor, resetAnonActor } = useAnonActor();
  const queryClient = useQueryClient();
  return useQuery<Tool[]>({
    queryKey: ["publicTools"],
    queryFn: async () => {
      if (!anonActor) {
        console.warn("[usePublicTools] anonActor nicht bereit");
        throw new Error("Actor nicht bereit");
      }
      await logCanisterId("usePublicTools");
      try {
        const result = await (anonActor as any).getPublicTools();
        if (!Array.isArray(result)) {
          console.error("[usePublicTools] Unerwartetes Ergebnis:", result);
          return [];
        }
        console.log(
          `[usePublicTools] ${result.length} öffentliche Tools geladen`,
        );
        return result.map(normalizeTool);
      } catch (e) {
        console.error("[usePublicTools] Fehler beim Laden:", e);
        if (isCanisterStopped(e)) {
          console.log(
            "[usePublicTools] Canister gestoppt – Actor wird neu erstellt",
          );
          resetAnonActor();
          queryClient.invalidateQueries({ queryKey: ["publicTools"] });
          queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
        }
        throw new Error(friendlyError(e, "getPublicTools"));
      }
    },
    enabled: !!anonActor,
    retry: 5,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 30000),
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
}

export function useAllToolsAdmin() {
  const { anonActor, resetAnonActor } = useAnonActor();
  const queryClient = useQueryClient();
  return useQuery<Tool[]>({
    queryKey: ["allToolsAdmin"],
    queryFn: async () => {
      if (!anonActor) {
        console.warn("[useAllToolsAdmin] anonActor nicht bereit, warte...");
        throw new Error("Actor nicht bereit – bitte kurz warten");
      }
      await logCanisterId("useAllToolsAdmin");
      try {
        const result = await (anonActor as any).getAllToolsAdmin();
        if (!Array.isArray(result)) {
          console.error(
            "[useAllToolsAdmin] Unerwartetes Ergebnis vom Backend:",
            result,
          );
          throw new Error("Ungültiges Ergebnis vom Backend");
        }
        console.log(
          `[useAllToolsAdmin] ${result.length} Tools geladen (persistent im Backend)`,
        );
        return result.map(normalizeTool);
      } catch (e) {
        console.error("[useAllToolsAdmin] Fehler beim Laden:", e);
        if (isCanisterStopped(e)) {
          console.log(
            "[useAllToolsAdmin] Canister gestoppt – Actor wird neu erstellt",
          );
          resetAnonActor();
          queryClient.invalidateQueries({ queryKey: ["publicTools"] });
          queryClient.invalidateQueries({ queryKey: ["allToolsAdmin"] });
        }
        throw new Error(friendlyError(e, "getAllToolsAdmin"));
      }
    },
    enabled: !!anonActor,
    retry: 5,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 30000),
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
}

export function useCreateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: CreateToolArgs) => {
      if (!actor) throw new Error("Not authenticated – bitte neu einloggen");
      await logCanisterId("useCreateTool");
      try {
        const result = await (actor as any).createTool(args);
        console.log(
          `[useCreateTool] Tool erfolgreich persistent gespeichert, ID: ${result}`,
        );
        return result;
      } catch (e) {
        console.error("[useCreateTool] Speichern fehlgeschlagen:", e);
        throw new Error(friendlyError(e, "createTool"));
      }
    },
    onSuccess: (id) => {
      console.log(
        `[useCreateTool] Persistenz bestätigt – invalidiere Tool-Cache (ID: ${id})`,
      );
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
      await logCanisterId("useUpdateTool");
      try {
        const result = await (actor as any).updateTool(id, args);
        console.log(
          `[useUpdateTool] Tool ${String(id)} aktualisiert: ${result}`,
        );
        return result;
      } catch (e) {
        console.error("[useUpdateTool] Fehler:", e);
        throw new Error(friendlyError(e, "updateTool"));
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
      await logCanisterId("useDeleteTool");
      try {
        const result = await (actor as any).deleteTool(id);
        console.log(`[useDeleteTool] Tool ${String(id)} gelöscht: ${result}`);
        return result;
      } catch (e) {
        console.error("[useDeleteTool] Fehler:", e);
        throw new Error(friendlyError(e, "deleteTool"));
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
