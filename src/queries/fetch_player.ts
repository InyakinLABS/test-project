import { apiGet, encodePlayerPath } from "@/lib/api_client";
import { MMRData, PlayerAccount } from "@/types/responses";

const DEFAULT_PLATFORM = "pc";

export async function fetchAccount(
  name: string,
  tag: string,
): Promise<PlayerAccount> {
  return apiGet<PlayerAccount>(`/v1/account/${encodePlayerPath(name, tag)}`);
}

export async function fetchMMR(
  region: string,
  name: string,
  tag: string,
  platform: string = DEFAULT_PLATFORM,
): Promise<MMRData> {
  return apiGet<MMRData>(
    `/v3/mmr/${region}/${platform}/${encodePlayerPath(name, tag)}`,
  );
}

export { DEFAULT_PLATFORM };
