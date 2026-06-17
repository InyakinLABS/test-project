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
  page?: number;
}): string {
  const params = new URLSearchParams();

  if (options.mode) params.set("mode", options.mode);
  if (options.size) params.set("size", String(options.size));
  if (options.start !== undefined) params.set("start", String(options.start));
  if (options.page) params.set("page", String(options.page));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function fetchMatchesV4(
  options: FetchMatchesOptions,
): Promise<MatchesV4Response[]> {
  const platform = options.platform ?? DEFAULT_PLATFORM;
  const query = buildMatchQuery({
    mode: options.mode,
    size: options.size ?? 30,
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
  options?: { mode?: string; size?: number; page?: number },
): Promise<StoredMatchesResult> {
  const query = buildMatchQuery({
    mode: options?.mode,
    size: options?.size ?? 50,
    page: options?.page,
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

export async function fetchAllStoredMatches(
  region: string,
  name: string,
  tag: string,
  options?: { mode?: string; pageSize?: number },
): Promise<StoredMatchesResult> {
  const pageSize = options?.pageSize ?? 50;
  const allMatches: StoredMatch[] = [];
  let total = 0;
  let page = 1;

  while (true) {
    const batch = await fetchStoredMatches(region, name, tag, {
      mode: options?.mode,
      size: pageSize,
      page,
    });

    total = batch.total;
    allMatches.push(...batch.matches);

    if (allMatches.length >= total || batch.matches.length < pageSize) {
      break;
    }

    page++;
  }

  return {
    matches: allMatches,
    total,
    returned: allMatches.length,
  };
}

export { DEFAULT_PLATFORM };
