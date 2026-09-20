import type { Request, Response, NextFunction } from "express";
import { isGuildAdmin } from "../utils/discordPermissions.js";
import { ensureValidToken } from "../utils/refreshDiscordToken.js";

export async function requireGuildAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const guildId = req.params.guildId as string;
  const accessToken = await ensureValidToken(req);

  if (!accessToken) {
    res.status(401).json({ error: "Não autenticado. Faça login primeiro." });
    return;
  }

  const guildsResponse = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!guildsResponse.ok) {
    res
      .status(400)
      .json({ error: "Falha ao verificar permissões no Discord." });
    return;
  }

  const userGuilds = (await guildsResponse.json()) as Array<{
    id: string;
    permissions: string;
  }>;

  const guild = userGuilds.find((g) => g.id === guildId);

  if (!guild || !isGuildAdmin(guild.permissions)) {
    res.status(403).json({
      error: "Você não tem permissão de administrador nesse servidor.",
    });
    return;
  }

  next();
}
