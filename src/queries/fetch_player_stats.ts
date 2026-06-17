import { normalizeStoredMatch } from "@/lib/match_utils";
import { aggregateMatchStats } from "@/lib/stats_utils";
import {
  fetchAllNormalizedMatches,
  fetchAllStoredMatches,
  fetchNormalizedMatches,
} from "./fetch_matches";
import { LifetimeStats, NormalizedMatch, PlayerStats } from "@/types/responses";

export interface FetchStatsOptions {
  region: string;
  name: string;
  tag: string;
  mode?: string;
  limit?: number;
  maxMatches?: number;
}

function mergeMatchesById(matches: NormalizedMatch[]): NormalizedMatch[] {
  const byId = new Map<string, NormalizedMatch>();

  for (const match of matches) {
    byId.set(match.id, match);
  }

  return Array.from(byId.values());
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
  const mode = options.mode || "competitive";

  const [liveMatches, stored] = await Promise.all([
    fetchAllNormalizedMatches({
      region: options.region,
      name: options.name,
      tag: options.tag,
      mode,
      maxMatches: options.maxMatches ?? 200,
    }),
    fetchAllStoredMatches(options.region, options.name, options.tag, {
      mode,
      pageSize: 50,
    }).catch(() => ({ matches: [], total: 0, returned: 0 })),
  ]);

  const storedNormalized = stored.matches.map(normalizeStoredMatch);
  const merged = mergeMatchesById([...liveMatches, ...storedNormalized]);
  const stats = aggregateMatchStats(merged);

  return {
    ...stats,
    fetchedMatches: merged.length,
    henrikStoredTotal: stored.total,
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
