import { Router } from "express";
import { requireGuildAdmin } from "../middlewares/requireGuildAdmin.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  welcomeConfigSchema,
  type WelcomeConfigInput,
} from "../schemas/welcome.schema.js";
import { WelcomeConfigModel } from "../models/WelcomeConfig.js";

export const welcomeRouter = Router();

welcomeRouter.get("/:guildId/welcome", requireGuildAdmin, async (req, res) => {
  const guildId = req.params.guildId as string;

  const config = await WelcomeConfigModel.findOne({ guildId });

  if (!config) {
    res
      .status(404)
      .json({ error: "Nenhuma configuração de boas-vindas encontrada." });
    return;
  }

  res.json(config);
});

welcomeRouter.put(
  "/:guildId/welcome",
  requireGuildAdmin,
  validateBody(welcomeConfigSchema),
  async (req, res) => {
    const guildId = req.params.guildId as string;
    const { channelId, enabled, components } = req.body as WelcomeConfigInput;

    const config = await WelcomeConfigModel.findOneAndUpdate(
      { guildId },
      { guildId, channelId, enabled, components },
      { upsert: true, returnDocument: "after" },
    );

    res.json(config);
  },
);
