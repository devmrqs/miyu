import { Router } from "express";
import { client } from "../config/client.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { isGuildAdmin } from "../utils/discordPermissions.js";
import { ensureValidToken } from "../utils/refreshDiscordToken.js";

export const guildsRouter = Router();

guildsRouter.get("/", requireAuth, async (req, res) => {
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
    res.status(400).json({ error: "Falha ao buscar servidores no Discord." });
    return;
  }

  const userGuilds = (await guildsResponse.json()) as Array<{
    id: string;
    name: string;
    icon: string | null;
    permissions: string;
  }>;

  const adminGuilds = userGuilds.filter((guild) =>
    isGuildAdmin(guild.permissions),
  );

  const guildsWithBot = adminGuilds
    .filter((guild) => client.guilds.cache.has(guild.id))
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
    }));

  res.json(guildsWithBot);
});
