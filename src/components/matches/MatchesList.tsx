import { NormalizedMatch } from "@/types/responses";
import { MatchCard } from "@/components/matchCard/match_card";
import { Loader } from "@/components/common/Loader";
import { Pagination } from "./Pagination";

interface MatchesListProps {
  matches: NormalizedMatch[];
  isLoading: boolean;
  page: number;
  hasNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function MatchesList({
  matches,
  isLoading,
  page,
  hasNext,
  onPrevPage,
  onNextPage,
}: MatchesListProps) {
  return (
    <div className="matches-section">
      <h2 className="matches-section__title">Последние матчи</h2>

      {isLoading ? (
        <Loader text="Загрузка матчей..." />
      ) : matches.length ? (
        <>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
          <Pagination
            page={page}
            hasNext={hasNext}
            onPrev={onPrevPage}
            onNext={onNextPage}
          />
        </>
      ) : (
        <div className="empty">Нет матчей</div>
      )}
    </div>
  );
}
