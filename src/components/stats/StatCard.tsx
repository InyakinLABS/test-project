interface StatCardProps {
  value: string | number;
  label: string;
  hint?: string;
}

export function StatCard({ value, label, hint }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </div>
  );
}
