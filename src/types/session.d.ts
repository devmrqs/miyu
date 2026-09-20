import "express-session";

declare module "express-session" {
  interface SessionData {
    discordAccessToken?: string;
    discordRefreshToken?: string;
    discordTokenExpiresAt?: number;
    discordUserId?: string;
  }
}
