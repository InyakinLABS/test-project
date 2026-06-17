import { BASE_URL, headers } from "@/types/constants";
import { Match, MatchPlayer, MMRData, PlayerAccount } from "@/types/responses";

export async function fetchAccount(
  name: string,
  tag: string,
): Promise<PlayerAccount> {
  const res = await fetch(`${BASE_URL}/v1/account/${name}/${tag}`, { headers });
  if (!res.ok) {
    throw new Error(`Account not found: ${res.status}`);
  }
  const data = await res.json();

  return data.data;
}
export function findPlayerInMatch(
  match: Match,
  playerName: string,
): MatchPlayer | null {
  return match.players.all_players.find((p) => p.name === playerName) || null;
}

export async function fetchMMR(name: string, tag: string): Promise<MMRData> {
  const res = await fetch(`${BASE_URL}/v3/mmr/eu/${name}/${tag}`, { headers });
  if (!res.ok) {
    throw new Error(`MMR not found: ${res.status}`);
  }
  const data = await res.json();
  return data.data;
}
