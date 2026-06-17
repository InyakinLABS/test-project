import { apiGet, encodePlayerPath } from "@/lib/api_client";
import { BASE_URL, headers } from "@/types/constants";
import { normalizeV4Match } from "@/lib/match_utils";
import {
  MatchesV4Response,
  NormalizedMatch,
  StoredMatch,
  StoredMatchesResult,
} from "@/types/responses";

const DEFAULT_PLATFORM = "pc";

export interface FetchMatchesOptions {
  region: string;
  name: string;
  tag: string;
  mode?: string;
  size?: number;
  start?: number;
  platform?: string;
}

function buildMatchQuery(options: {
  mode?: string;
  size?: number;
  start?: number;
}): string {
  const params = new URLSearchParams();

  if (options.mode) params.set("mode", options.mode);
  if (options.size) params.set("size", String(options.size));
  if (options.start) params.set("start", String(options.start));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function fetchMatchesV4(
  options: FetchMatchesOptions,
): Promise<MatchesV4Response[]> {
  const platform = options.platform ?? DEFAULT_PLATFORM;
  const query = buildMatchQuery({
    mode: options.mode,
    size: options.size ?? 10,
    start: options.start ?? 0,
  });

  return apiGet<MatchesV4Response[]>(
    `/v4/matches/${options.region}/${platform}/${encodePlayerPath(options.name, options.tag)}${query}`,
  );
}

export async function fetchNormalizedMatches(
  options: FetchMatchesOptions,
): Promise<NormalizedMatch[]> {
  const matches = await fetchMatchesV4(options);

  return matches
    .map((match) => normalizeV4Match(match, options.name, options.tag))
    .filter((match): match is NormalizedMatch => match !== null);
}

export async function fetchStoredMatches(
  region: string,
  name: string,
  tag: string,
  options?: { mode?: string; size?: number },
): Promise<StoredMatchesResult> {
  const query = buildMatchQuery({
    mode: options?.mode,
    size: options?.size ?? 100,
  });

  const res = await fetch(
    `${BASE_URL}/v1/stored-matches/${region}/${encodePlayerPath(name, tag)}${query}`,
    { headers },
  );

  if (!res.ok) {
    throw new Error(`Stored matches not found: ${res.status}`);
  }

  const json = await res.json();

  return {
    matches: (json.data ?? []) as StoredMatch[],
    total: json.results?.total ?? json.data?.length ?? 0,
    returned: json.results?.returned ?? json.data?.length ?? 0,
  };
}

export { DEFAULT_PLATFORM };
