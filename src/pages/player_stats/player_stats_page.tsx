// app/player/[name]/[tag]/page.tsx
"use client";
import "./page.scss";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAccount, fetchMMR } from "@/queries/fetch_player";
import { fetchMatches } from "@/queries/fetch_matches";
import { fetchPlayerStats } from "@/queries/fetch_player_stats";
import { PlayerCard } from "@/components/playerCard/player_card";
import { MatchCard } from "@/components/matchCard/match_card";

export default function PlayerPage() {
  const params = useParams();
  const name = params?.name as string;
  const tag = params?.tag as string;

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["account", name, tag],
    queryFn: () => fetchAccount(name, tag),
  });

  const { data: mmr } = useQuery({
    queryKey: ["mmr", name, tag],
    queryFn: () => fetchMMR(name, tag),
    enabled: !!account,
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", name, tag],
    queryFn: () => fetchMatches(name, tag, 10),
    enabled: !!account,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats", name, tag],
    queryFn: () => fetchPlayerStats(name, tag, 10),
    enabled: !!account,
  });

  if (accountLoading) {
    return <div className="loader">Загрузка...</div>;
  }

  if (!account) {
    return <div className="error">Игрок не найден</div>;
  }

  return (
    <div className="player-page">
      <div className="player-page__container">
        <PlayerCard account={account} mmr={mmr} />

        {stats && (
          <div className="player-page__stats-grid">
            <div className="stat-card">
              <span className="stat-card__value">{stats.totalMatches}</span>
              <span className="stat-card__label">Матчей</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__value">
                {stats.winRate.toFixed(0)}%
              </span>
              <span className="stat-card__label">Винрейт</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__value">{stats.kd.toFixed(2)}</span>
              <span className="stat-card__label">KD</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__value">
                {Math.round(stats.avgACS)}
              </span>
              <span className="stat-card__label">ACS</span>
            </div>
          </div>
        )}

        <div className="player-page__matches">
          <h2 className="player-page__matches-title">Последние матчи</h2>
          {matchesLoading ? (
            <div className="loader">Загрузка матчей...</div>
          ) : matches?.length ? (
            matches.map((match, i) => (
              <MatchCard key={i} match={match} playerName={name} />
            ))
          ) : (
            <div className="empty">Нет матчей</div>
          )}
        </div>
      </div>
    </div>
  );
}
