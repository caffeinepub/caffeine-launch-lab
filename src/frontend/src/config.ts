import {
  createActor,
  type backendInterface,
  type CreateActorOptions,
  ExternalBlob,
} from "./backend";
import { StorageClient } from "./utils/StorageClient";
import { HttpAgent } from "@icp-sdk/core/agent";

const DEFAULT_STORAGE_GATEWAY_URL = "https://blob.caffeine.ai";
const DEFAULT_BUCKET_NAME = "default-bucket";
const DEFAULT_PROJECT_ID = "0000000-0000-0000-0000-00000000000";

interface JsonConfig {
  backend_host: string;
  backend_canister_id: string;
  project_id: string;
  ii_derivation_origin: string;
}

interface Config {
  backend_host?: string;
  backend_canister_id: string;
  storage_gateway_url: string;
  bucket_name: string;
  project_id: string;
  ii_derivation_origin?: string;
}

// IMPORTANT: No module-level configCache.
// The old configCache caused the frontend to reuse a stale/broken canister ID
// after a deploy (even frontend-only). Now env.json is always fetched fresh
// with cache:"no-store" so the current deployed canister ID is always used.

export async function loadConfig(): Promise<Config> {
  const backendCanisterId = process.env.CANISTER_ID_BACKEND;
  const envBaseUrl = process.env.BASE_URL || "/";
  const baseUrl = envBaseUrl.endsWith("/") ? envBaseUrl : `${envBaseUrl}/`;

  // Retry loop: env.json may briefly return "undefined" right after a deploy
  // while the CDN propagates. Retry up to 4 times with 1-second delay.
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(`${baseUrl}env.json`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      const config = (await response.json()) as JsonConfig;

      const resolvedCanisterId =
        config.backend_canister_id !== "undefined"
          ? config.backend_canister_id
          : backendCanisterId;

      if (!resolvedCanisterId || resolvedCanisterId === "undefined") {
        // env.json not yet propagated — wait and retry
        if (attempt < 3) {
          console.warn(
            `[config] env.json returned "undefined" canister ID (attempt ${attempt + 1}/4), retrying in 1s...`,
          );
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        throw new Error("CANISTER_ID_BACKEND is not set");
      }

      const fullConfig: Config = {
        backend_host:
          config.backend_host === "undefined" ? undefined : config.backend_host,
        backend_canister_id: resolvedCanisterId,
        storage_gateway_url: process.env.STORAGE_GATEWAY_URL ?? "nogateway",
        bucket_name: DEFAULT_BUCKET_NAME,
        project_id:
          config.project_id !== "undefined"
            ? config.project_id
            : DEFAULT_PROJECT_ID,
        ii_derivation_origin:
          config.ii_derivation_origin === "undefined"
            ? undefined
            : config.ii_derivation_origin,
      };

      console.log(
        `[config] Canister ID geladen: ${fullConfig.backend_canister_id} (host: ${fullConfig.backend_host ?? "mainnet"})`,
      );
      return fullConfig;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  // Absolute fallback: use build-time env var if available
  if (backendCanisterId && backendCanisterId !== "undefined") {
    console.warn(
      `[config] Fallback auf build-time Canister ID: ${backendCanisterId}`,
    );
    return {
      backend_host: undefined,
      backend_canister_id: backendCanisterId,
      storage_gateway_url: DEFAULT_STORAGE_GATEWAY_URL,
      bucket_name: DEFAULT_BUCKET_NAME,
      project_id: DEFAULT_PROJECT_ID,
      ii_derivation_origin: undefined,
    };
  }

  throw lastError ?? new Error("CANISTER_ID_BACKEND is not set");
}

function extractAgentErrorMessage(error: string): string {
  const errorString = String(error);
  const match = errorString.match(/with message:\s*'([^']+)'/s);
  return match ? match[1] : errorString;
}

function processError(e: unknown): never {
  if (e && typeof e === "object" && "message" in e) {
    throw new Error(extractAgentErrorMessage(`${e.message}`));
  }
  throw e;
}

async function maybeLoadMockBackend(): Promise<backendInterface | null> {
  if (import.meta.env.VITE_USE_MOCK !== "true") {
    return null;
  }

  try {
    const mockModules = import.meta.glob("./mocks/backend.{ts,tsx,js,jsx}");
    const path = Object.keys(mockModules)[0];
    if (!path) return null;
    const mod = (await mockModules[path]()) as {
      mockBackend?: backendInterface;
    };
    return mod.mockBackend ?? null;
  } catch {
    return null;
  }
}

export async function createActorWithConfig(
  options?: CreateActorOptions,
): Promise<backendInterface> {
  const mock = await maybeLoadMockBackend();
  if (mock) {
    return mock;
  }

  // Always load config fresh — no module-level cache
  const config = await loadConfig();
  const resolvedOptions = options ?? {};
  const agent = new HttpAgent({
    ...resolvedOptions.agentOptions,
    host: config.backend_host,
  });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running",
      );
      console.error(err);
    });
  }
  const actorOptions = {
    ...resolvedOptions,
    agent: agent,
    processError,
  };

  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );

  const MOTOKO_DEDUPLICATION_SENTINEL = "!caf!";

  const uploadFile = async (file: ExternalBlob): Promise<Uint8Array> => {
    const { hash } = await storageClient.putFile(
      await file.getBytes(),
      file.onProgress,
    );
    return new TextEncoder().encode(MOTOKO_DEDUPLICATION_SENTINEL + hash);
  };

  const downloadFile = async (bytes: Uint8Array): Promise<ExternalBlob> => {
    const hashWithPrefix = new TextDecoder().decode(new Uint8Array(bytes));
    const hash = hashWithPrefix.substring(MOTOKO_DEDUPLICATION_SENTINEL.length);
    const url = await storageClient.getDirectURL(hash);
    return ExternalBlob.fromURL(url);
  };

  return createActor(
    config.backend_canister_id,
    uploadFile,
    downloadFile,
    actorOptions,
  );
}
