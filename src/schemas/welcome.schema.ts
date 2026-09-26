import { z } from "zod";
import { componentGroupSchema } from "./message.schema.js";

export const welcomeConfigSchema = z.object({
  channelId: z.string().min(1),
  enabled: z.boolean().default(true),
  components: z.array(componentGroupSchema).min(1).max(10),
});

export type WelcomeConfigInput = z.infer<typeof welcomeConfigSchema>;
