import { PlayerStats } from "@/types/responses";
import { fetchMatches } from "./fetch_matches";

export async function fetchPlayerStats(
  name: string,
  tag: string,
  limit: number = 10,
): Promise<PlayerStats> {
  const matches = await fetchMatches(name, tag, limit);

  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalHS = 0;
  let totalACS = 0;
  let wins = 0;
  let count = 0;

  for (const match of matches) {
    const player = match.players.all_players.find((p) => p.name === name);
    if (!player) continue;

    const stats = player.stats;
    totalKills += stats.kills || 0;
    totalDeaths += stats.deaths || 0;
    totalAssists += stats.assists || 0;
    totalHS += stats.headshots_percent || 0;
    totalACS += stats.average_combat_score || 0;

    if (player.team === match.teams.winner) {
      wins++;
    }
    count++;
  }

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
    kd: totalDeaths > 0 ? totalKills / totalDeaths : 0,
    kda: totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : 0,
  };
}
