"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchAccount, fetchMMR } from "@/queries/fetch_player";
import { fetchNormalizedMatches } from "@/queries/fetch_matches";
import {
  fetchLifetimeStats,
  fetchRecentPlayerStats,
} from "@/queries/fetch_player_stats";
import { PlayerCard } from "@/components/playerCard/player_card";
import { SearchForm } from "@/components/search/SearchForm";
import { ModeFilter } from "@/components/filters/ModeFilter";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { MatchesList } from "@/components/matches/MatchesList";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const PAGE_SIZE = 10;

export function HomePage() {
  const searchParams = useSearchParams();
  const initialName = searchParams?.get("name") ?? "sosiska";
  const initialTag = searchParams?.get("tag") ?? "8812";

  const [name, setName] = useState(initialName);
  const [tag, setTag] = useState(initialTag);
  const [searchName, setSearchName] = useState(initialName);
  const [searchTag, setSearchTag] = useState(initialTag);
  const [mode, setMode] = useState("");
  const [page, setPage] = useState(0);

  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useQuery({
    queryKey: ["account", searchName, searchTag],
    queryFn: () => fetchAccount(searchName, searchTag),
    enabled: !!searchName && !!searchTag,
  });

  const region = account?.region ?? "eu";

  const { data: mmr, isLoading: mmrLoading } = useQuery({
    queryKey: ["mmr", region, searchName, searchTag],
    queryFn: () => fetchMMR(region, searchName, searchTag),
    enabled: !!account,
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", region, searchName, searchTag, mode, page],
    queryFn: () =>
      fetchNormalizedMatches({
        region,
        name: searchName,
        tag: searchTag,
        mode: mode || undefined,
        size: PAGE_SIZE,
        start: page * PAGE_SIZE,
      }),
    enabled: !!account,
  });

  const { data: recentStats } = useQuery({
    queryKey: ["stats-recent", region, searchName, searchTag, mode],
    queryFn: () =>
      fetchRecentPlayerStats({
        region,
        name: searchName,
        tag: searchTag,
        mode: mode || undefined,
        limit: 20,
      }),
    enabled: !!account,
  });

  const { data: lifetimeStats } = useQuery({
    queryKey: ["stats-lifetime", region, searchName, searchTag, mode],
    queryFn: () =>
      fetchLifetimeStats({
        region,
        name: searchName,
        tag: searchTag,
        mode: mode || "competitive",
        maxMatches: 200,
      }),
    enabled: !!account,
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchName(name.trim());
    setSearchTag(tag.trim());
    setPage(0);
  };

  const handleModeChange = (value: string) => {
    setMode(value);
    setPage(0);
  };

  return (
    <main className="app__main">
      <div className="app__container">
        <SearchForm
          name={name}
          tag={tag}
          onNameChange={setName}
          onTagChange={setTag}
          onSubmit={handleSearch}
        />

        {account && <ModeFilter value={mode} onChange={handleModeChange} />}

        {accountError && (
          <ErrorMessage message="Игрок не найден. Проверьте имя и тег." />
        )}

        {accountLoading && <Loader text="Загрузка профиля..." />}

        {account && (
          <>
            <PlayerCard account={account} mmr={mmr} />
            {mmrLoading && <Loader text="Загрузка ранга..." />}

            <StatsGrid
              recentStats={recentStats}
              lifetimeStats={lifetimeStats}
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
          </>
        )}
      </div>
    </main>
  );
}
