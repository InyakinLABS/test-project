import { apiGet } from "@/lib/api_client";
import { MatchDetail } from "@/types/responses";

export async function fetchMatch(
  region: string,
  matchId: string,
): Promise<MatchDetail> {
  return apiGet<MatchDetail>(`/v4/match/${region}/${matchId}`);
}
