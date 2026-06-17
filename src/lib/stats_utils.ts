import { getMatchACS, getMatchHeadshotPercent } from "@/lib/match_utils";
import { NormalizedMatch, PlayerStats } from "@/types/responses";

export function aggregateMatchStats(matches: NormalizedMatch[]): PlayerStats {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalHS = 0;
  let totalACS = 0;
  let wins = 0;

  for (const match of matches) {
    const stats = match.stats;
    totalKills += stats.kills;
    totalDeaths += stats.deaths;
    totalAssists += stats.assists;
    totalHS += getMatchHeadshotPercent(match);
    totalACS += getMatchACS(match);
    if (match.won) wins++;
  }

  const count = matches.length;

  return {
    totalMatches: count,
    wins,
    losses: count - wins,
    winRate: count > 0 ? (wins / count) * 100 : 0,
    totalKills,
    totalDeaths,
    totalAssists,
    avgHS: count > 0 ? totalHS / count : 0,
    avgACS: count > 0 ? totalACS / count : 0,
    kd: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    kda:
      totalDeaths > 0
        ? (totalKills + totalAssists) / totalDeaths
        : totalKills + totalAssists,
  };
}

export function formatKD(kd: number): string {
  return kd.toFixed(2);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatACS(value: number): string {
  return Math.round(value).toString();
}
