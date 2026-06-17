import { normalizeStoredMatch } from "@/lib/match_utils";
import { aggregateMatchStats } from "@/lib/stats_utils";
import { fetchNormalizedMatches, fetchStoredMatches } from "./fetch_matches";
import { LifetimeStats, PlayerStats } from "@/types/responses";

export interface FetchStatsOptions {
  region: string;
  name: string;
  tag: string;
  mode?: string;
  limit?: number;
}

export async function fetchRecentPlayerStats(
  options: FetchStatsOptions,
): Promise<PlayerStats> {
  const matches = await fetchNormalizedMatches({
    region: options.region,
    name: options.name,
    tag: options.tag,
    mode: options.mode,
    size: options.limit ?? 20,
    start: 0,
  });

  return aggregateMatchStats(matches);
}

export async function fetchLifetimeStats(
  options: FetchStatsOptions,
): Promise<LifetimeStats> {
  const stored = await fetchStoredMatches(
    options.region,
    options.name,
    options.tag,
    {
      mode: options.mode || "competitive",
      size: options.limit ?? 100,
    },
  );

  const normalized = stored.matches.map(normalizeStoredMatch);
  const stats = aggregateMatchStats(normalized);

  return {
    ...stats,
    totalStoredMatches: stored.total,
  };
}

// Backward-compatible alias used by existing pages
export async function fetchPlayerStats(
  name: string,
  tag: string,
  limit: number = 20,
  region: string = "eu",
): Promise<PlayerStats> {
  return fetchRecentPlayerStats({ region, name, tag, limit });
}
