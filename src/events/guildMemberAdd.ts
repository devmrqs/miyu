import { MessageFlags, ChannelType } from "discord.js";
import type { GuildMember } from "discord.js";
import type { BotEvent } from "../types/event.js";
import { WelcomeConfigModel } from "../models/WelcomeConfig.js";
import { replaceVariablesInBlocks } from "../utils/replaceVariables.js";
import { buildContainer } from "../utils/buildContainer.js";

const event: BotEvent<"guildMemberAdd"> = {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    const config = await WelcomeConfigModel.findOne({
      guildId: member.guild.id,
      enabled: true,
    });

    if (!config) {
      return;
    }

    const channel = member.guild.channels.cache.get(config.channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      console.warn(
        `[welcome] canal configurado não encontrado para a guild ${member.guild.id}`,
      );
      return;
    }

    const context = {
      userMention: `<@${member.id}>`,
      userName: member.user.username,
      userAvatarUrl: member.user.displayAvatarURL(),
      guildName: member.guild.name,
      memberCount: member.guild.memberCount,
    };

    const blocksWithVariables = replaceVariablesInBlocks(
      config.blocks as never[],
      context,
    );

    const container = buildContainer({
      blocks: blocksWithVariables as never,
      accentColor: config.accentColor,
    });

    try {
      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
      });
    } catch (error) {
      console.error(`[welcome] erro ao enviar mensagem de boas-vindas:`, error);
    }
  },
};

export default event;
