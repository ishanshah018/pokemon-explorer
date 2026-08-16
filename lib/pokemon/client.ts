import { ApiError } from "@/types/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchJson<T>(
  endpoint: string,
  revalidateSeconds: number = 3600
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${POKEAPI_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      const error: ApiError = {
        kind: "not-found",
        message: "The requested Pokemon or resource could not be found.",
      };
      throw error;
    }

    if (!response.ok) {
      const error: ApiError = {
        kind: "unknown",
        status: response.status,
        message: `HTTP request failed with status ${response.status}.`,
      };
      throw error;
    }

    const data: T = await response.json();
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err && typeof err === "object" && "kind" in err) {
      throw err as ApiError;
    }

    if (err instanceof Error && err.name === "AbortError") {
      const error: ApiError = {
        kind: "network",
        message: "Request timed out after 8 seconds.",
      };
      throw error;
    }

    const error: ApiError = {
      kind: "network",
      message:
        err instanceof Error
          ? err.message
          : "Network connection issue occurred.",
    };
    throw error;
  }
}
