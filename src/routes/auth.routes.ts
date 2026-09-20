import { Router } from "express";

export const authRouter = Router();

authRouter.get("/discord", (_req, res) => {
  const { CLIENT_ID, REDIRECT_URI } = process.env;

  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI!,
    response_type: "code",
    scope: "identify guilds",
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

authRouter.get("/discord/callback", async (req, res) => {
  const { code } = req.query;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Código de autorização ausente." });
    return;
  }

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI!,
    }),
  });

  if (!tokenResponse.ok) {
    res.status(400).json({ error: "Falha ao trocar o código pelo token." });
    return;
  }

  const tokenData = await tokenResponse.json();
  const { access_token, refresh_token, expires_in } = tokenData;

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const user = await userResponse.json();

  req.session.discordAccessToken = access_token;
  req.session.discordRefreshToken = refresh_token;
  req.session.discordTokenExpiresAt = Date.now() + expires_in * 1000;
  req.session.discordUserId = user.id;

  const { FRONTEND_URL } = process.env;
  res.redirect(`${FRONTEND_URL}/dashboard`);
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ error: "Falha ao encerrar a sessão." });
      return;
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logout realizado com sucesso." });
  });
});

authRouter.get("/me", async (req, res) => {
  if (!req.session.discordAccessToken) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }

  res.json({ userId: req.session.discordUserId });
});
