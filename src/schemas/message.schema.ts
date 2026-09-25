import { z } from "zod";

const urlOrVariable = z.string().refine(
  (value) => {
    const isValidUrl = z.string().url().safeParse(value).success;
    const isPlaceholder = /^\{[a-z_]+\}$/.test(value);
    return isValidUrl || isPlaceholder;
  },
  { message: "Deve ser uma URL válida ou uma variável como {avatar_usuario}." },
);

const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1).max(4000),
});

const separatorBlockSchema = z.object({
  type: z.literal("separator"),
});

const buttonLinkBlockSchema = z.object({
  type: z.literal("button-link"),
  label: z.string().min(1).max(80),
  url: z.string().url(),
  emoji: z.string().optional(),
});

const buttonActionBlockSchema = z.object({
  type: z.literal("button-action"),
  label: z.string().min(1).max(80),
  actionId: z.string().min(1),
  style: z
    .enum(["primary", "secondary", "success", "danger"])
    .default("primary"),
});

const sectionThumbnailBlockSchema = z.object({
  type: z.literal("section-thumbnail"),
  content: z.string().min(1).max(4000),
  imageUrl: urlOrVariable,
});

const mediaGalleryBlockSchema = z.object({
  type: z.literal("media-gallery"),
  images: z.array(urlOrVariable).min(1).max(10),
});

const blockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  separatorBlockSchema,
  buttonLinkBlockSchema,
  buttonActionBlockSchema,
  sectionThumbnailBlockSchema,
  mediaGalleryBlockSchema,
]);

export const createMessageSchema = z.object({
  channelId: z.string().min(1),
  blocks: z.array(blockSchema).min(1).max(20),
  accentColor: z
    .preprocess(
      (val) => {
        if (!val || val === "" || val === "null" || val === "undefined") {
          return null;
        }
        return val;
      },
      z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .nullable(),
    )
    .optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
