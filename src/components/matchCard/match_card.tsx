"use client";

import "./match_card_styles.scss";
import {
  formatMatchDate,
  getMatchACS,
  getMatchHeadshotPercent,
} from "@/lib/match_utils";
import { NormalizedMatch } from "@/types/responses";

interface MatchCardProps {
  match: NormalizedMatch;
}

export function MatchCard({ match }: MatchCardProps) {
  const stats = match.stats;
  const headshotPercent = getMatchHeadshotPercent(match);
  const acs = getMatchACS(match);

  return (
    <div
      className={`match-card ${match.won ? "match-card--win" : "match-card--loss"}`}
    >
      <div className="match-card__top">
        <div className="match-card__info">
          <span className="match-card__mode">{match.mode}</span>
          <span className="match-card__map">{match.map}</span>
          <span className="match-card__time">
            {formatMatchDate(match.startedAt)}
          </span>
        </div>
        <div className="match-card__result">
          <span className="match-card__score">
            {match.roundsWon} : {match.roundsLost}
          </span>
          <span
            className={`match-card__status ${match.won ? "match-card__status--win" : "match-card__status--loss"}`}
          >
            {match.won ? "Победа" : "Поражение"}
          </span>
        </div>
      </div>

      <div className="match-card__bottom">
        <span className="match-card__agent">{match.agent}</span>
        <div className="match-card__stats">
          <span className="match-card__kda">
            {stats.kills} / {stats.deaths} / {stats.assists}
          </span>
          <span className="match-card__hs">HS: {headshotPercent.toFixed(0)}%</span>
          <span className="match-card__acs">ACS: {Math.round(acs)}</span>
        </div>
      </div>
    </div>
  );
}
