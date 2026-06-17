export interface PlayerAccount {
  puuid: string;
  name: string;
  tag: string;
  region: string;
  account_level: number;
  card: {
    small: string;
    large: string;
    wide: string;
    id: string;
  };
}

export interface MatchStats {
  kills: number;
  deaths: number;
  assists: number;
  headshots_percent: number;
  average_combat_score: number;
}

export interface MatchPlayer {
  name: string;
  tag?: string;
  character: string;
  team: string;
  stats: MatchStats;
}

export interface Match {
  metadata: {
    map: string;
    mode: string;
    game_start: string;
    game_length: number;
  };
  players: {
    all_players: MatchPlayer[];
  };
  teams: {
    winner: string;
    [teamName: string]: { rounds_won: number } | string;
  };
}

export interface PlayerStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  avgHS: number;
  avgACS: number;
  kd: number;
  kda: number;
}

export interface MMRData {
  current_data: {
    currenttier: number;
    currenttierpatched: string;
    elo: number;
  };
  highest_rank: {
    patched_tier: string;
  };
}
