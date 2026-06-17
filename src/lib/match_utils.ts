import {
  MatchPlayerStats,
  MatchesV4Response,
  NormalizedMatch,
  StoredMatch,
} from "@/types/responses";

export function calculateHeadshotPercent(stats: {
  headshots?: number;
  bodyshots?: number;
  legshots?: number;
  shots?: { head: number; body: number; leg: number };
}): number {
  const headshots = stats.headshots ?? stats.shots?.head ?? 0;
  const bodyshots = stats.bodyshots ?? stats.shots?.body ?? 0;
  const legshots = stats.legshots ?? stats.shots?.leg ?? 0;
  const total = headshots + bodyshots + legshots;
  return total > 0 ? (headshots / total) * 100 : 0;
}

export function calculateACS(score: number, roundsPlayed: number): number {
  return roundsPlayed > 0 ? score / roundsPlayed : 0;
}

export function findPlayerInV4Match(
  match: MatchesV4Response,
  name: string,
  tag?: string,
) {
  const normalizedName = name.toLowerCase();
  const normalizedTag = tag?.toLowerCase();

  return (
    match.players.find((player) => {
      const nameMatch = player.name.toLowerCase() === normalizedName;
      if (!normalizedTag) return nameMatch;
      return nameMatch && player.tag.toLowerCase() === normalizedTag;
    }) ?? null
  );
}

export function normalizeV4Match(
  match: MatchesV4Response,
  playerName: string,
  playerTag?: string,
): NormalizedMatch | null {
  const player = findPlayerInV4Match(match, playerName, playerTag);
  if (!player) return null;

  const playerTeam = match.teams.find((team) => team.team_id === player.team_id);
  if (!playerTeam) return null;

  const enemyTeam = match.teams.find((team) => team.team_id !== player.team_id);
  const totalRounds =
    playerTeam.rounds.won +
    (enemyTeam?.rounds.won ?? playerTeam.rounds.lost);

  return {
    id: match.metadata.match_id,
    map: match.metadata.map?.name ?? "Unknown",
    mode:
      match.metadata.queue?.name ??
      match.metadata.queue?.mode_type ??
      match.metadata.queue?.id ??
      "Unknown",
    startedAt: match.metadata.started_at,
    roundsPlayed: totalRounds,
    playerName: player.name,
    playerTag: player.tag,
    agent: player.agent?.name ?? "Unknown",
    teamId: player.team_id,
    stats: {
      kills: player.stats.kills,
      deaths: player.stats.deaths,
      assists: player.stats.assists,
      headshots: player.stats.headshots,
      bodyshots: player.stats.bodyshots,
      legshots: player.stats.legshots,
      score: player.stats.score,
    },
    roundsWon: playerTeam.rounds.won,
    roundsLost: enemyTeam?.rounds.won ?? playerTeam.rounds.lost,
    won: playerTeam.won,
  };
}

export function normalizeStoredMatch(match: StoredMatch): NormalizedMatch {
  const playerRounds = match.teams[match.stats.team as "red" | "blue"] ?? 0;
  const enemyTeam = match.stats.team === "red" ? "blue" : "red";
  const enemyRounds = match.teams[enemyTeam] ?? 0;
  const won = playerRounds > enemyRounds;

  return {
    id: match.meta.id,
    map: match.meta.map?.name ?? "Unknown",
    mode: match.meta.mode,
    startedAt: match.meta.started_at,
    roundsPlayed: playerRounds + enemyRounds,
    playerName: match.stats.name ?? "",
    playerTag: match.stats.tag ?? "",
    agent: match.stats.character?.name ?? "Unknown",
    teamId: match.stats.team,
    stats: {
      kills: match.stats.kills,
      deaths: match.stats.deaths,
      assists: match.stats.assists,
      headshots: match.stats.shots.head,
      bodyshots: match.stats.shots.body,
      legshots: match.stats.shots.leg,
      score: match.stats.score,
    },
    roundsWon: playerRounds,
    roundsLost: enemyRounds,
    won,
  };
}

export function formatMatchDate(startedAt: string): string {
  try {
    const date = new Date(startedAt);
    if (Number.isNaN(date.getTime())) return "Неизвестно";

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Неизвестно";
  }
}

export function getMatchHeadshotPercent(match: NormalizedMatch): number {
  return calculateHeadshotPercent(match.stats);
}

export function getMatchACS(match: NormalizedMatch): number {
  return calculateACS(match.stats.score, match.roundsPlayed);
}

export function toMatchPlayerStats(stats: MatchPlayerStats): MatchPlayerStats {
  return stats;
}
