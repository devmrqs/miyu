import { Schema, model } from "mongoose";

interface WelcomeConfig {
  guildId: string;
  channelId: string;
  enabled: boolean;
  blocks: unknown[];
  accentColor?: string;
}

const welcomeConfigSchema = new Schema<WelcomeConfig>(
  {
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    blocks: { type: [Schema.Types.Mixed], required: true },
    accentColor: { type: String },
  },
  { timestamps: true },
);

export const WelcomeConfigModel = model<WelcomeConfig>(
  "WelcomeConfig",
  welcomeConfigSchema,
);
