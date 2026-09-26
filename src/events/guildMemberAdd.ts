import { MessageFlags, ChannelType } from "discord.js";
import type { GuildMember } from "discord.js";
import type { BotEvent } from "../types/event.js";
import { WelcomeConfigModel } from "../models/WelcomeConfig.js";
import { replaceVariablesInBlocks } from "../utils/replaceVariables.js";
import { buildContainers } from "../utils/buildContainer.js";
import type { ComponentGroupInput } from "../schemas/message.schema.js";

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

    const componentsWithVariables = (
      config.components as ComponentGroupInput[]
    ).map((component) => ({
      ...component,
      blocks: replaceVariablesInBlocks(component.blocks as never[], context),
    })) as ComponentGroupInput[];

    const containers = buildContainers(componentsWithVariables);

    try {
      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: containers,
      });
    } catch (error) {
      console.error(`[welcome] erro ao enviar mensagem de boas-vindas:`, error);
    }
  },
};

export default event;
