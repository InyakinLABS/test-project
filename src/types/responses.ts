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

export interface TierInfo {
  id: number;
  name: string;
}

export interface MMRData {
  account: {
    puuid: string;
    name: string;
    tag: string;
  };
  current: {
    tier: TierInfo;
    rr: number;
    elo: number;
    last_change: number;
    games_needed_for_rating: number;
  };
  peak: {
    tier: TierInfo;
    rr: number;
    season: { id: string; short: string };
  } | null;
  seasonal: Array<{
    season: { id: string; short: string };
    wins: number;
    games: number;
    final_rank: TierInfo;
    act_rank: TierInfo;
  }>;
}

export interface MatchPlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  score: number;
}

export interface NormalizedMatch {
  id: string;
  map: string;
  mode: string;
  startedAt: string;
  roundsPlayed: number;
  playerName: string;
  playerTag: string;
  agent: string;
  teamId: string;
  stats: MatchPlayerStats;
  roundsWon: number;
  roundsLost: number;
  won: boolean;
}

export interface MatchesV4Response {
  metadata: {
    match_id: string;
    map: { id: string; name: string };
    queue: { id: string; name: string | null; mode_type: string | null };
    started_at: string;
    game_length_in_ms: number;
  };
  players: Array<{
    puuid: string;
    name: string;
    tag: string;
    team_id: string;
    agent: { id: string; name: string };
    stats: MatchPlayerStats & {
      damage: { dealt: number; received: number };
    };
  }>;
  teams: Array<{
    team_id: string;
    won: boolean;
    rounds: { won: number; lost: number };
  }>;
}

export interface StoredMatch {
  meta: {
    id: string;
    map: { name: string };
    mode: string;
    started_at: string;
    region: string;
  };
  stats: {
    puuid: string;
    name: string | null;
    tag: string | null;
    team: string;
    kills: number;
    deaths: number;
    assists: number;
    score: number;
    shots: {
      head: number;
      body: number;
      leg: number;
    };
    character: { name: string };
  };
  teams: {
    red: number;
    blue: number;
  };
}

export interface StoredMatchesResult {
  matches: StoredMatch[];
  total: number;
  returned: number;
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

export interface LifetimeStats extends PlayerStats {
  totalStoredMatches: number;
}
