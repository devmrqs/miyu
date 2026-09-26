import { Router } from "express";
import { ChannelType, MessageFlags } from "discord.js";
import { client } from "../config/client.js";
import { requireGuildAdmin } from "../middlewares/requireGuildAdmin.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createMessageSchema } from "../schemas/message.schema.js";
import { buildContainers } from "../utils/buildContainer.js";
import type { CreateMessageInput } from "../schemas/message.schema.js";

export const messagesRouter = Router();

messagesRouter.post(
  "/:guildId/messages",
  requireGuildAdmin,
  validateBody(createMessageSchema),
  async (req, res) => {
    const guildId = req.params.guildId as string;
    const { channelId, components } = req.body as CreateMessageInput;

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      res
        .status(404)
        .json({ error: "A Miyu não está presente nesse servidor." });
      return;
    }

    const channel = guild.channels.cache.get(channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      res
        .status(404)
        .json({ error: "Canal de texto não encontrado nesse servidor." });
      return;
    }

    const containers = buildContainers(components);

    try {
      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: containers,
      });

      res.status(201).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      console.error("[messages] erro ao enviar mensagem:", error);
      res.status(500).json({ error: "Falha ao enviar a mensagem no Discord." });
    }
  },
);
