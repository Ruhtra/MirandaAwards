import { z } from 'zod'

// export const gameSchema = z.object({
//   kind: z.literal('Game'),
//   userId: z.string(),
// })
// export const gameWithVoteSchema = z.object({
//   kind: z.literal('GameWithVote'),
//   userId: z.string(),
// })

export const gameSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('list'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Game'), z.literal('GameWithVote')]),
])

// export type gameSubject = z.infer<typeof gameSchema>
