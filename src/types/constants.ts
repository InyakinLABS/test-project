export const API_KEY = process.env.NEXT_PUBLIC_HENRIK_API_KEY;
export const BASE_URL = "https://api.henrikdev.xyz/valorant";

export const headers = {
  Authorization: API_KEY || "",
};
