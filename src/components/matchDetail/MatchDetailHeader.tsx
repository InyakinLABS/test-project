import { formatMatchDate } from "@/lib/match_utils";
import {
  formatDuration,
  getMatchMode,
  getMatchRoundsPlayed,
} from "@/lib/match_detail_utils";
import { MatchDetail } from "@/types/responses";

interface MatchDetailHeaderProps {
  match: MatchDetail;
}

export function MatchDetailHeader({ match }: MatchDetailHeaderProps) {
  const teamA = match.teams[0];
  const teamB = match.teams[1];
  const mode = getMatchMode(match);
  const roundsPlayed = getMatchRoundsPlayed(match);

  return (
    <section className="match-detail__header">
      <div className="match-detail__meta">
        <span className="match-detail__mode">{mode}</span>
        <h1 className="match-detail__map">{match.metadata.map.name}</h1>
        <p className="match-detail__date">
          {formatMatchDate(match.metadata.started_at)}
        </p>
      </div>

      <div className="match-detail__scoreboard">
        <div
          className={`match-detail__team-score ${teamA?.won ? "match-detail__team-score--win" : ""}`}
        >
          <span className="match-detail__team-label">{teamA?.team_id}</span>
          <span className="match-detail__team-value">{teamA?.rounds.won}</span>
        </div>
        <span className="match-detail__score-divider">:</span>
        <div
          className={`match-detail__team-score ${teamB?.won ? "match-detail__team-score--win" : ""}`}
        >
          <span className="match-detail__team-label">{teamB?.team_id}</span>
          <span className="match-detail__team-value">{teamB?.rounds.won}</span>
        </div>
      </div>

      <div className="match-detail__facts">
        <div className="match-detail__fact">
          <span className="match-detail__fact-label">Длительность</span>
          <span className="match-detail__fact-value">
            {formatDuration(match.metadata.game_length_in_ms)}
          </span>
        </div>
        <div className="match-detail__fact">
          <span className="match-detail__fact-label">Раундов</span>
          <span className="match-detail__fact-value">{roundsPlayed}</span>
        </div>
        {match.metadata.season?.short && (
          <div className="match-detail__fact">
            <span className="match-detail__fact-label">Сезон</span>
            <span className="match-detail__fact-value">
              {match.metadata.season.short}
            </span>
          </div>
        )}
        {match.metadata.game_version && (
          <div className="match-detail__fact">
            <span className="match-detail__fact-label">Версия</span>
            <span className="match-detail__fact-value">
              {match.metadata.game_version}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
