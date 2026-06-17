import { isHighlightedPlayer } from "@/lib/match_detail_utils";

interface MatchPlayerRowProps {
  player: {
    name: string;
    tag: string;
    agent: { name: string };
    tier?: { name: string };
    account_level?: number;
    stats: {
      kills: number;
      deaths: number;
      assists: number;
      score: number;
      damage: { dealt: number; received: number };
    };
    headshotPercent: number;
    acs: number;
    kd: number;
    economy?: {
      spent: { overall: number };
      loadout_value: { overall: number };
    };
  };
  highlight?: { name?: string; tag?: string };
}

export function MatchPlayerRow({ player, highlight }: MatchPlayerRowProps) {
  const highlighted = isHighlightedPlayer(player, highlight);

  return (
    <div
      className={`match-player-row ${highlighted ? "match-player-row--highlight" : ""}`}
    >
      <div className="match-player-row__identity">
        <span className="match-player-row__agent">{player.agent.name}</span>
        <span className="match-player-row__name">
          {player.name}
          <span className="match-player-row__tag">#{player.tag}</span>
        </span>
        <span className="match-player-row__rank">
          {player.tier?.name ?? "Unranked"} · lvl {player.account_level ?? "?"}
        </span>
      </div>

      <div className="match-player-row__stats">
        <span className="match-player-row__kda">
          {player.stats.kills}/{player.stats.deaths}/{player.stats.assists}
        </span>
        <span className="match-player-row__stat">
          ACS {Math.round(player.acs)}
        </span>
        <span className="match-player-row__stat">
          HS {player.headshotPercent.toFixed(0)}%
        </span>
        <span className="match-player-row__stat">
          DMG {player.stats.damage.dealt}
        </span>
        <span className="match-player-row__stat">
          KD {player.kd.toFixed(2)}
        </span>
        {player.economy && (
          <span className="match-player-row__stat">
            ₡ {player.economy.spent.overall}
          </span>
        )}
      </div>
    </div>
  );
}
