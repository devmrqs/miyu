import { z } from "zod";
import { createMessageSchema } from "./message.schema.js";

export const welcomeConfigSchema = z.object({
  channelId: z.string().min(1),
  enabled: z.boolean().default(true),
  blocks: createMessageSchema.shape.blocks,
  accentColor: createMessageSchema.shape.accentColor,
});

export type WelcomeConfigInput = z.infer<typeof welcomeConfigSchema>;
