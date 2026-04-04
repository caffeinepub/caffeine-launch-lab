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
// Previously, configCache was a module-level singleton that cached the canister ID
// forever. After a deploy, the cached value from before the deploy was reused,
// causing the frontend to call the wrong (old/stopped) canister.
// Now we always fetch env.json fresh with cache: "no-store" so each actor
// creation gets the current deployed canister ID.

async function fetchEnvConfig(retries = 3): Promise<JsonConfig> {
  const backendCanisterId = process.env.CANISTER_ID_BACKEND;
  const envBaseUrl = process.env.BASE_URL || "/";
  const baseUrl = envBaseUrl.endsWith("/") ? envBaseUrl : `${envBaseUrl}/`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // cache: "no-store" ensures we always get the freshly deployed env.json,
      // not a browser-cached version from before the last deployment.
      const response = await fetch(`${baseUrl}env.json`, {
        cache: "no-store",
        headers: { "pragma": "no-cache", "cache-control": "no-cache" },
      });
      const config = (await response.json()) as JsonConfig;

      const resolvedId =
        config.backend_canister_id !== "undefined"
          ? config.backend_canister_id
          : backendCanisterId;

      if (!resolvedId) {
        // env.json has "undefined" and no compile-time fallback — retry
        if (attempt < retries - 1) {
          console.warn(
            `[config] env.json has no canister ID on attempt ${attempt + 1}, retrying...`,
          );
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        throw new Error("CANISTER_ID_BACKEND is not set in env.json");
      }

      console.log(`[config] Backend canister ID: ${resolvedId}`);
      return {
        ...config,
        backend_canister_id: resolvedId,
      };
    } catch (e: unknown) {
      const isLast = attempt === retries - 1;
      const msg = e instanceof Error ? e.message : String(e);
      if (isLast) throw e;
      console.warn(`[config] fetch env.json failed (attempt ${attempt + 1}): ${msg}, retrying...`);
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error("[config] Failed to load env.json after retries");
}

export async function loadConfig(): Promise<Config> {
  const config = await fetchEnvConfig();

  return {
    backend_host:
      config.backend_host === "undefined" ? undefined : config.backend_host,
    backend_canister_id: config.backend_canister_id,
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
}

function extractAgentErrorMessage(error: string): string {
  const errorString = String(error);
  const match = errorString.match(/with message:\s*'([^']+)'/s);
  return match ? match[1] : errorString;
}

function processError(e: unknown): never {
  if (e && typeof e === "object" && "message" in e) {
    throw new Error(extractAgentErrorMessage(`${(e as { message: string }).message}`));
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

  // Always load config fresh — no singleton cache.
  // This guarantees that after a deploy the new env.json canister ID is used.
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
