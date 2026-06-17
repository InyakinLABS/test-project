// app/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import "./globals.css";
import { fetchAccount, fetchMMR } from "@/queries/fetch_player";
import { fetchMatches } from "@/queries/fetch_matches";
import { fetchPlayerStats } from "@/queries/fetch_player_stats";
import { PlayerCard } from "@/components/playerCard/player_card";
import { MatchCard } from "@/components/matchCard/match_card";

const MODES = [
  { value: "", label: "Все режимы" },
  { value: "competitive", label: "Соревновательный" },
  { value: "unrated", label: "Обычный" },
  { value: "deathmatch", label: "Deathmatch" },
  { value: "spikerush", label: "Spike Rush" },
  { value: "escalation", label: "Escalation" },
];

export default function Home() {
  const [name, setName] = useState("sosiska");
  const [tag, setTag] = useState("8812");
  const [searchName, setSearchName] = useState("sosiska");
  const [searchTag, setSearchTag] = useState("8812");
  const [mode, setMode] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useQuery({
    queryKey: ["account", searchName, searchTag],
    queryFn: () => fetchAccount(searchName, searchTag),
    enabled: !!searchName && !!searchTag,
  });

  const { data: mmr } = useQuery({
    queryKey: ["mmr", searchName, searchTag],
    queryFn: () => fetchMMR(searchName, searchTag),
    enabled: !!account,
  });

  const {
    data: matches = [],
    isLoading: matchesLoading,
    refetch,
  } = useQuery({
    queryKey: ["matches", searchName, searchTag, mode, page],
    queryFn: () => fetchMatches(searchName, searchTag, limit, page * limit),
    enabled: !!account,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats", searchName, searchTag],
    queryFn: () => fetchPlayerStats(searchName, searchTag, 10),
    enabled: !!account,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchName(name.trim());
    setSearchTag(tag.trim());
    setPage(0);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
    setPage(0);
  };

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🎯 Valorant Tracker</h1>
      </header>

      <main className="app__main">
        <div className="app__container">
          {/* Поиск */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-form__fields">
              <input
                type="text"
                placeholder="Имя игрока"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="search-form__input"
              />
              <span className="search-form__separator">#</span>
              <input
                type="text"
                placeholder="Тег"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="search-form__input search-form__input--tag"
              />
            </div>
            <button type="submit" className="search-form__button">
              Найти
            </button>
          </form>

          {/* Фильтр */}
          {account && (
            <div className="filters">
              <select
                value={mode}
                onChange={handleModeChange}
                className="filters__select"
              >
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ошибка */}
          {accountError && (
            <div className="error">
              ❌ Игрок не найден. Проверьте имя и тег.
            </div>
          )}

          {/* Загрузка */}
          {accountLoading && <div className="loader">Загрузка профиля...</div>}

          {/* Профиль */}
          {account && (
            <>
              <PlayerCard account={account} mmr={mmr} />

              {stats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-card__value">
                      {stats.totalMatches}
                    </span>
                    <span className="stat-card__label">Матчей</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__value">
                      {stats.winRate.toFixed(0)}%
                    </span>
                    <span className="stat-card__label">Винрейт</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__value">
                      {stats.kd.toFixed(2)}
                    </span>
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

              <div className="matches-section">
                <h2 className="matches-section__title">Последние матчи</h2>

                {matchesLoading ? (
                  <div className="loader">Загрузка матчей...</div>
                ) : matches?.length ? (
                  <>
                    {matches.map((match, i) => (
                      <MatchCard
                        key={i}
                        match={match}
                        playerName={searchName}
                      />
                    ))}

                    {/* Пагинация */}
                    <div className="pagination">
                      <button
                        onClick={prevPage}
                        disabled={page === 0}
                        className="pagination__button"
                      >
                        ← Назад
                      </button>
                      <span className="pagination__info">
                        Страница {page + 1}
                      </span>
                      <button onClick={nextPage} className="pagination__button">
                        Вперёд →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty">Нет матчей</div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
