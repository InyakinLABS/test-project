import { BASE_URL, headers } from "@/types/constants";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.errors?.[0]?.message) {
        message = body.errors[0].message;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  const json = await res.json();
  return json.data as T;
}

export function encodePlayerPath(name: string, tag: string): string {
  return `${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
}
