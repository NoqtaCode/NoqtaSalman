import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

export const isSanityConfigured = Boolean(projectId && dataset);

export function assertSanityConfigured() {
  if (!isSanityConfigured) {
    throw new Error("Sanity is not configured for this site. Add the new site's project ID and dataset.");
  }
}

export function getSanityWriteError() {
  if (!isSanityConfigured) return "missing-config" as const;
  if (!process.env.SANITY_API_TOKEN?.trim()) return "missing-token" as const;
  return null;
}

// Re-export from the central types file for backward compatibility
export type { SiteSettings } from "../types";

export const client = createClient({
  // This placeholder is never queried unless the new site's environment is configured.
  projectId: projectId || "newproject",
  dataset: dataset || "production",
  apiVersion: "2024-01-01",
  // Read directly from the dataset so dashboard edits are not held in Sanity's CDN.
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  timeout: 60000,
  maxRetries: 3,
});

export async function safeFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    return (await client.fetch(query, params, { cache: "no-store" })) as T;
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}

/** Read Sanity without Next.js or Sanity CDN caching so dashboard edits show immediately. */
export async function safeFetchFresh<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    return (await client.withConfig({ useCdn: false }).fetch(query, params, { cache: "no-store" })) as T;
  } catch (error) {
    console.error("Fresh Sanity fetch failed:", error);
    return fallback;
  }
}
