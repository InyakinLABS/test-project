"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAccount } from "@/queries/fetch_player";
import { fetchNormalizedMatches } from "@/queries/fetch_matches";
import { PlayerCard } from "@/components/playerCard/player_card";
import { ModeFilter } from "@/components/filters/ModeFilter";
import { MatchesList } from "@/components/matches/MatchesList";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const PAGE_SIZE = 30;

export function PlayerMatchesPage() {
  const params = useParams();
  const name = params?.name as string;
  const tag = params?.tag as string;
  const [mode, setMode] = useState("");
  const [page, setPage] = useState(0);

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["account", name, tag],
    queryFn: () => fetchAccount(name, tag),
    enabled: !!name && !!tag,
  });

  const region = account?.region ?? "eu";

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", region, name, tag, mode, page],
    queryFn: () =>
      fetchNormalizedMatches({
        region,
        name,
        tag,
        mode: mode || undefined,
        size: PAGE_SIZE,
        start: page * PAGE_SIZE,
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
        <PlayerCard account={account} />
        <ModeFilter
          value={mode}
          onChange={(value) => {
            setMode(value);
            setPage(0);
          }}
        />
        <MatchesList
          matches={matches}
          region={region}
          isLoading={matchesLoading}
          page={page}
          hasNext={matches.length === PAGE_SIZE}
          onPrevPage={() => setPage((current) => Math.max(0, current - 1))}
          onNextPage={() => setPage((current) => current + 1)}
        />
      </div>
    </div>
  );
}
