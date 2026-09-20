import type { Request, Response, NextFunction } from "express";
import { ensureValidToken } from "../utils/refreshDiscordToken.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = await ensureValidToken(req);

  if (!token) {
    res.status(401).json({ error: "Não autenticado. Faça login primeiro." });
    return;
  }

  next();
}
