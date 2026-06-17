import { formatACS, formatKD, formatPercent } from "@/lib/stats_utils";
import { LifetimeStats, PlayerStats } from "@/types/responses";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  recentStats?: PlayerStats;
  lifetimeStats?: LifetimeStats;
}

export function StatsGrid({ recentStats, lifetimeStats }: StatsGridProps) {
  if (!recentStats && !lifetimeStats) return null;

  return (
    <div className="stats-section">
      {recentStats && (
        <div className="stats-section__group">
          <h3 className="stats-section__title">Последние матчи</h3>
          <div className="stats-grid">
            <StatCard value={recentStats.totalMatches} label="Матчей" />
            <StatCard
              value={formatPercent(recentStats.winRate)}
              label="Винрейт"
            />
            <StatCard value={formatKD(recentStats.kd)} label="KD" />
            <StatCard value={formatKD(recentStats.kda)} label="KDA" />
            <StatCard
              value={formatPercent(recentStats.avgHS)}
              label="HS%"
            />
            <StatCard value={formatACS(recentStats.avgACS)} label="ACS" />
          </div>
        </div>
      )}

      {lifetimeStats && (
        <div className="stats-section__group">
          <h3 className="stats-section__title">
            All-time (competitive, до {lifetimeStats.totalStoredMatches})
          </h3>
          <div className="stats-grid">
            <StatCard
              value={lifetimeStats.totalMatches}
              label="Матчей"
              hint={`из ${lifetimeStats.totalStoredMatches}`}
            />
            <StatCard
              value={formatPercent(lifetimeStats.winRate)}
              label="Винрейт"
            />
            <StatCard
              value={formatKD(lifetimeStats.kd)}
              label="All-time KD"
            />
            <StatCard value={formatKD(lifetimeStats.kda)} label="KDA" />
            <StatCard
              value={formatPercent(lifetimeStats.avgHS)}
              label="HS%"
            />
            <StatCard value={formatACS(lifetimeStats.avgACS)} label="ACS" />
          </div>
        </div>
      )}
    </div>
  );
}
