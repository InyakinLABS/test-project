import { BASE_URL, headers } from "@/types/constants";
import { Match } from "@/types/responses";

export async function fetchMatches(
  name: string,
  tag: string,
  limit: number = 10,
  offset: number = 0,
): Promise<Match[]> {
  const res = await fetch(
    `${BASE_URL}/v3/matches/eu/${name}/${tag}?size=${limit}&offset=${offset}`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`Matches not found: ${res.status}`);
  }
  const data = await res.json();
  return data.data || [];
}

export async function fetchMatchesWithFilter(
  name: string,
  tag: string,
  mode: string = "competitive",
  limit: number = 10,
  offset: number = 0,
): Promise<Match[]> {
  const res = await fetch(
    `${BASE_URL}/v3/matches/eu/${name}/${tag}?filter=${mode}&size=${limit}&offset=${offset}`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`Matches not found: ${res.status}`);
  }
  const data = await res.json();
  return data.data || [];
}
