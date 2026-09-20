import type { Request } from "express";

export async function ensureValidToken(req: Request): Promise<string | null> {
  const { discordAccessToken, discordRefreshToken, discordTokenExpiresAt } =
    req.session;

  if (!discordAccessToken || !discordRefreshToken) {
    return null;
  }

  const fiveMinutes = 5 * 60 * 1000;
  const isExpiringSoon =
    !discordTokenExpiresAt || Date.now() > discordTokenExpiresAt - fiveMinutes;

  if (!isExpiringSoon) {
    return discordAccessToken;
  }

  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: discordRefreshToken,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  req.session.discordAccessToken = data.access_token;
  req.session.discordRefreshToken = data.refresh_token;
  req.session.discordTokenExpiresAt = Date.now() + data.expires_in * 1000;

  return data.access_token;
}
