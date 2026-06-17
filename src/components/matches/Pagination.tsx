interface PaginationProps {
  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  page,
  hasNext,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="pagination__button"
      >
        ← Назад
      </button>
      <span className="pagination__info">Страница {page + 1}</span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="pagination__button"
      >
        Вперёд →
      </button>
    </div>
  );
}
