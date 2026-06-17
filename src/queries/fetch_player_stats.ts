import { aggregateMatchStats } from "@/lib/stats_utils";
import { fetchNormalizedMatches } from "./fetch_matches";
import { PlayerStats } from "@/types/responses";

export interface FetchStatsOptions {
  region: string;
  name: string;
  tag: string;
  mode?: string;
  limit?: number;
  maxMatches?: number;
}

export async function fetchRecentPlayerStats(
  options: FetchStatsOptions,
): Promise<PlayerStats> {
  const matches = await fetchNormalizedMatches({
    region: options.region,
    name: options.name,
    tag: options.tag,
    mode: options.mode,
    size: options.limit ?? 30,
    start: 0,
  });

  return aggregateMatchStats(matches);
}

// Backward-compatible alias used by existing pages
export async function fetchPlayerStats(
  name: string,
  tag: string,
  limit: number = 30,
  region: string = "eu",
): Promise<PlayerStats> {
  return fetchRecentPlayerStats({ region, name, tag, limit });
}
