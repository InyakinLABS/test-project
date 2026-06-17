import { groupPlayersByTeam } from "@/lib/match_detail_utils";
import { MatchDetail } from "@/types/responses";
import { MatchPlayerRow } from "./MatchPlayerRow";

interface MatchTeamsProps {
  match: MatchDetail;
  highlight?: { name?: string; tag?: string };
}

export function MatchTeams({ match, highlight }: MatchTeamsProps) {
  const teams = groupPlayersByTeam(match);

  return (
    <section className="match-detail__teams">
      {teams.map((team) => (
        <div
          key={team.teamId}
          className={`match-detail__team ${team.won ? "match-detail__team--win" : "match-detail__team--loss"}`}
        >
          <div className="match-detail__team-header">
            <h2 className="match-detail__team-title">
              Команда {team.teamId}
            </h2>
            <div className="match-detail__team-result">
              <span className="match-detail__team-scoreline">
                {team.roundsWon} : {team.roundsLost}
              </span>
              <span
                className={`match-detail__team-status ${team.won ? "match-detail__team-status--win" : "match-detail__team-status--loss"}`}
              >
                {team.won ? "Победа" : "Поражение"}
              </span>
            </div>
          </div>

          <div className="match-detail__players">
            {team.players.map((player) => (
              <MatchPlayerRow
                key={player.puuid}
                player={player}
                highlight={highlight}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
