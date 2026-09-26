import { Schema, model } from "mongoose";

interface WelcomeConfig {
  guildId: string;
  channelId: string;
  enabled: boolean;
  components: unknown[];
}

const welcomeConfigSchema = new Schema<WelcomeConfig>(
  {
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    components: { type: [Schema.Types.Mixed], required: true },
  },
  { timestamps: true },
);

export const WelcomeConfigModel = model<WelcomeConfig>(
  "WelcomeConfig",
  welcomeConfigSchema,
);
