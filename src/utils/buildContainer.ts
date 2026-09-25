import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
  ThumbnailBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
} from "discord.js";
import type { CreateMessageInput } from "../schemas/message.schema.js";

type BuildContainerInput = Pick<CreateMessageInput, "blocks" | "accentColor">;

const buttonStyleMap = {
  primary: ButtonStyle.Primary,
  secondary: ButtonStyle.Secondary,
  success: ButtonStyle.Success,
  danger: ButtonStyle.Danger,
} as const;

export function buildContainer(input: BuildContainerInput): ContainerBuilder {
  const container = new ContainerBuilder();

  if (input.accentColor && input.accentColor.trim() !== "") {
    container.setAccentColor(parseInt(input.accentColor.replace("#", ""), 16));
  }

  for (const block of input.blocks) {
    switch (block.type) {
      case "text":
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(block.content),
        );
        break;

      case "separator":
        container.addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small),
        );
        break;

      case "button-link": {
        const button = new ButtonBuilder()
          .setLabel(block.label)
          .setURL(block.url)
          .setStyle(ButtonStyle.Link);

        if (block.emoji) {
          button.setEmoji(block.emoji);
        }

        container.addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().addComponents(button),
        );
        break;
      }

      case "button-action": {
        const button = new ButtonBuilder()
          .setLabel(block.label)
          .setCustomId(block.actionId)
          .setStyle(buttonStyleMap[block.style]);
        container.addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().addComponents(button),
        );
        break;
      }

      case "section-thumbnail": {
        const section = new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(block.content),
          )
          .setThumbnailAccessory(
            new ThumbnailBuilder({ media: { url: block.imageUrl } }),
          );
        container.addSectionComponents(section);
        break;
      }

      case "media-gallery": {
        const gallery = new MediaGalleryBuilder().addItems(
          ...block.images.map((url) =>
            new MediaGalleryItemBuilder().setURL(url),
          ),
        );
        container.addMediaGalleryComponents(gallery);
        break;
      }
    }
  }

  return container;
}
