import { MatchDetail } from "@/types/responses";

interface MatchRoundsProps {
  rounds: NonNullable<MatchDetail["rounds"]>;
}

const RESULT_LABELS: Record<string, string> = {
  attackers_eliminated: "Elim",
  defenders_eliminated: "Elim",
  bomb_defused: "Defuse",
  bomb_exploded: "Detonate",
  surrender: "Surrender",
};

export function MatchRounds({ rounds }: MatchRoundsProps) {
  if (!rounds.length) return null;

  return (
    <section className="match-detail__rounds">
      <h2 className="match-detail__section-title">Раунды</h2>
      <div className="match-detail__rounds-grid">
        {rounds.map((round) => (
          <div
            key={round.id}
            className={`match-round-chip match-round-chip--${round.winning_team}`}
            title={`${round.result} · ${round.ceremony}`}
          >
            <span className="match-round-chip__id">{round.id + 1}</span>
            <span className="match-round-chip__result">
              {RESULT_LABELS[round.result] ?? round.result}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
