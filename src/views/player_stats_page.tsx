"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAccount, fetchMMR } from "@/queries/fetch_player";
import { fetchNormalizedMatches } from "@/queries/fetch_matches";
import {
  fetchLifetimeStats,
  fetchRecentPlayerStats,
} from "@/queries/fetch_player_stats";
import { PlayerCard } from "@/components/playerCard/player_card";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { MatchesList } from "@/components/matches/MatchesList";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export function PlayerStatsPage() {
  const params = useParams();
  const name = params?.name as string;
  const tag = params?.tag as string;

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["account", name, tag],
    queryFn: () => fetchAccount(name, tag),
    enabled: !!name && !!tag,
  });

  const region = account?.region ?? "eu";

  const { data: mmr } = useQuery({
    queryKey: ["mmr", region, name, tag],
    queryFn: () => fetchMMR(region, name, tag),
    enabled: !!account,
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", region, name, tag],
    queryFn: () =>
      fetchNormalizedMatches({
        region,
        name,
        tag,
        size: 30,
        start: 0,
      }),
    enabled: !!account,
  });

  const { data: recentStats } = useQuery({
    queryKey: ["stats-recent", region, name, tag],
    queryFn: () =>
      fetchRecentPlayerStats({
        region,
        name,
        tag,
        limit: 30,
      }),
    enabled: !!account,
  });

  const { data: lifetimeStats } = useQuery({
    queryKey: ["stats-lifetime", region, name, tag],
    queryFn: () =>
      fetchLifetimeStats({
        region,
        name,
        tag,
        mode: "competitive",
        maxMatches: 200,
      }),
    enabled: !!account,
  });

  if (accountLoading) {
    return <Loader text="Загрузка..." />;
  }

  if (!account) {
    return <ErrorMessage message="Игрок не найден" />;
  }

  return (
    <div className="player-page">
      <div className="player-page__container">
        <PlayerCard account={account} mmr={mmr} />
        <StatsGrid recentStats={recentStats} lifetimeStats={lifetimeStats} />
        <MatchesList
          matches={matches}
          region={region}
          isLoading={matchesLoading}
          page={0}
          hasNext={false}
          onPrevPage={() => undefined}
          onNextPage={() => undefined}
        />
      </div>
    </div>
  );
}
