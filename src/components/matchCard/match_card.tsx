// components/match/match_card.tsx
"use client";
import "./match_card_styles.scss";
import { findPlayerInMatch } from "@/queries/fetch_player";
import { Match } from "@/types/responses";

interface MatchCardProps {
  match: Match;
  playerName: string;
}

export function MatchCard({ match, playerName }: MatchCardProps) {
  const player = findPlayerInMatch(match, playerName);
  if (!player) return null;

  const stats = player.stats;
  const isWin = player.team === match.teams.winner;
  const teamData = match.teams[player.team] as { rounds_won: number };
  const score = teamData?.rounds_won || 0;

  let enemyScore = 0;
  for (const key in match.teams) {
    if (key !== "winner" && key !== player.team) {
      const data = match.teams[key] as { rounds_won: number };
      enemyScore += data?.rounds_won || 0;
    }
  }

  // ✅ Исправление даты — из timestamp в нормальную дату
  const timestamp = match.metadata.game_start;
  let timeStr = "Неизвестно";

  if (timestamp) {
    try {
      const date =
        typeof timestamp === "number"
          ? new Date(timestamp)
          : new Date(timestamp);
      if (!isNaN(date.getTime())) {
        timeStr = date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {
      timeStr = "Неизвестно";
    }
  }

  return (
    <div
      className={`match-card ${isWin ? "match-card--win" : "match-card--loss"}`}
    >
      <div className="match-card__top">
        <div className="match-card__info">
          <span className="match-card__mode">
            {match.metadata.mode || "Unknown"}
          </span>
          <span className="match-card__map">
            {match.metadata.map || "Unknown"}
          </span>
          <span className="match-card__time">{timeStr}</span>
        </div>
        <div className="match-card__result">
          <span className="match-card__score">
            {score} : {enemyScore}
          </span>
          <span
            className={`match-card__status ${isWin ? "match-card__status--win" : "match-card__status--loss"}`}
          >
            {isWin ? "Победа" : "Поражение"}
          </span>
        </div>
      </div>

      <div className="match-card__bottom">
        <span className="match-card__agent">
          {player.character || "Unknown"}
        </span>
        <div className="match-card__stats">
          <span className="match-card__kda">
            {stats.kills || 0} / {stats.deaths || 0} / {stats.assists || 0}
          </span>
          <span className="match-card__hs">
            HS: {stats.headshots_percent || 0}%
          </span>
          <span className="match-card__acs">
            ACS: {stats.average_combat_score || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
