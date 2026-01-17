import { z } from 'zod'

export const voteSchema = z.object({
  gameId: z.string().min(1, 'Jogo é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  score: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
})

export const voteUpdateSchema = z.object({
  score: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
})

export const bulkVoteSchema = z.object({
  gameId: z.string().min(1, 'Jogo é obrigatório'),
  votes: z.array(
    z.object({
      categoryId: z.string().min(1, 'Categoria é obrigatória'),
      score: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
      voted: z.boolean(), // Clear flag: true = save vote, false = delete vote
    }),
  ),
})

export type VoteInput = z.infer<typeof voteSchema>
export type VoteUpdateInput = z.infer<typeof voteUpdateSchema>
export type BulkVoteInput = z.infer<typeof bulkVoteSchema>
