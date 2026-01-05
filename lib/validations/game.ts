import { z } from "zod"

export const createGameSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    description: z.string().optional(),
    published: z.boolean().default(false),
    categoryIds: z.array(z.string()),
})

export const updateGameSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    description: z.string().optional().nullable(),
    published: z.boolean(),
    categoryIds: z.array(z.string()),
})

export type CreateGameInput = z.infer<typeof createGameSchema>
export type UpdateGameInput = z.infer<typeof updateGameSchema>
