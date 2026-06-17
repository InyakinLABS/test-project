"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMatch } from "@/queries/fetch_match";
import { MatchDetailHeader } from "@/components/matchDetail/MatchDetailHeader";
import { MatchTeams } from "@/components/matchDetail/MatchTeams";
import { MatchRounds } from "@/components/matchDetail/MatchRounds";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import "@/components/matchDetail/match_detail_styles.scss";

export function MatchPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const region = params?.region as string;
  const matchId = params?.matchId as string;
  const highlightName = searchParams?.get("name") ?? undefined;
  const highlightTag = searchParams?.get("tag") ?? undefined;

  const { data: match, isLoading, error } = useQuery({
    queryKey: ["match", region, matchId],
    queryFn: () => fetchMatch(region, matchId),
    enabled: !!region && !!matchId,
  });

  const backHref =
    highlightName && highlightTag
      ? `/?name=${encodeURIComponent(highlightName)}&tag=${encodeURIComponent(highlightTag)}`
      : "/";

  return (
    <main className="app__main">
      <div className="app__container match-detail">
        <Link href={backHref} className="match-detail__back">
          ← Назад к профилю
        </Link>

        {isLoading && <Loader text="Загрузка матча..." />}

        {error && <ErrorMessage message="Матч не найден или недоступен." />}

        {match && (
          <>
            <MatchDetailHeader match={match} />
            <MatchTeams
              match={match}
              highlight={{ name: highlightName, tag: highlightTag }}
            />
            {match.rounds && <MatchRounds rounds={match.rounds} />}
          </>
        )}
      </div>
    </main>
  );
}
