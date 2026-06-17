import { calculateACS, calculateHeadshotPercent } from "@/lib/match_utils";
import { MatchDetail } from "@/types/responses";

export function getMatchMode(match: MatchDetail): string {
  return (
    match.metadata.queue?.name ??
    match.metadata.queue?.mode_type ??
    match.metadata.queue?.id ??
    "Unknown"
  );
}

export function getMatchRoundsPlayed(match: MatchDetail): number {
  return match.teams.reduce(
    (total, team) => total + team.rounds.won + team.rounds.lost,
    0,
  );
}

export function groupPlayersByTeam(match: MatchDetail) {
  const teams = match.teams.map((team) => {
    const players = match.players
      .filter((player) => player.team_id === team.team_id)
      .map((player) => ({
        ...player,
        headshotPercent: calculateHeadshotPercent(player.stats),
        acs: calculateACS(player.stats.score, getMatchRoundsPlayed(match)),
        kd:
          player.stats.deaths > 0
            ? player.stats.kills / player.stats.deaths
            : player.stats.kills,
      }))
      .sort((a, b) => b.stats.score - a.stats.score);

    const enemyTeam = match.teams.find((entry) => entry.team_id !== team.team_id);

    return {
      teamId: team.team_id,
      won: team.won,
      roundsWon: team.rounds.won,
      roundsLost: enemyTeam?.rounds.won ?? team.rounds.lost,
      players,
    };
  });

  return teams.sort((a, b) => Number(b.won) - Number(a.won));
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function isHighlightedPlayer(
  player: { name: string; tag: string },
  highlight?: { name?: string; tag?: string },
): boolean {
  if (!highlight?.name) return false;

  const nameMatch =
    player.name.toLowerCase() === highlight.name.toLowerCase();
  if (!highlight.tag) return nameMatch;

  return nameMatch && player.tag.toLowerCase() === highlight.tag.toLowerCase();
}
