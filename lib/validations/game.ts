import { z } from "zod";

export const createGameSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()),
  imageUrl: z.string().optional().nullable(),
  imageFilename: z.string().optional().nullable(),
});

export const updateGameSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional().nullable(),
  published: z.boolean(),
  categoryIds: z.array(z.string()),
  imageUrl: z.string().optional().nullable(),
  imageFilename: z.string().optional().nullable(),
  imageRemoved: z.boolean().optional(),
  oldImageUrl: z.string().optional().nullable(),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
