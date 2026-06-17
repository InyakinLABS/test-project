import { MMRData } from "@/types/responses";

interface PlayerRankProps {
  mmr?: MMRData;
}

export function PlayerRank({ mmr }: PlayerRankProps) {
  if (!mmr) {
    return (
      <div className="player-card__rank">
        <div className="player-card__rank-item">
          <span className="player-card__rank-label">Ранг</span>
          <span className="player-card__rank-value">Нет данных</span>
        </div>
      </div>
    );
  }

  const currentRank = mmr.current?.tier?.name ?? "Unranked";
  const currentRR = mmr.current?.rr ?? 0;
  const currentElo = mmr.current?.elo ?? 0;
  const peakRank = mmr.peak?.tier?.name;

  return (
    <div className="player-card__rank">
      <div className="player-card__rank-item">
        <span className="player-card__rank-label">Текущий ранг</span>
        <span className="player-card__rank-value">{currentRank}</span>
        <span className="player-card__rank-elo">
          {currentRR} RR · {currentElo} elo
        </span>
      </div>

      {peakRank && (
        <div className="player-card__rank-item">
          <span className="player-card__rank-label">Пик</span>
          <span className="player-card__rank-value">{peakRank}</span>
          {mmr.peak?.season?.short && (
            <span className="player-card__rank-elo">
              {mmr.peak.season.short}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
