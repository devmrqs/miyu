interface VariableContext {
  userMention: string;
  userName: string;
  userAvatarUrl: string;
  guildName: string;
  memberCount: number;
}

function replaceInText(text: string, context: VariableContext): string {
  return text
    .replaceAll("{usuario}", context.userMention)
    .replaceAll("{nome}", context.userName)
    .replaceAll("{avatar_usuario}", context.userAvatarUrl)
    .replaceAll("{servidor}", context.guildName)
    .replaceAll("{contagem_membros}", context.memberCount.toString());
}

export function replaceVariablesInBlocks<T extends { type: string }>(
  blocks: T[],
  context: VariableContext,
): T[] {
  return blocks.map((block) => {
    const updated = { ...block };

    if ("content" in updated && typeof updated.content === "string") {
      (updated as { content: string }).content = replaceInText(
        updated.content,
        context,
      );
    }

    if ("imageUrl" in updated && typeof updated.imageUrl === "string") {
      (updated as { imageUrl: string }).imageUrl = replaceInText(
        updated.imageUrl,
        context,
      );
    }

    return updated;
  });
}
