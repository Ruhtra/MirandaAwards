import { z } from 'zod'

export const voteSchema = z.object({
  kind: z.literal('Vote'),
  id: z.string(),
})

export const voteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('list'),
    z.literal('create'),
    z.literal('update'),
  ]),
  z.union([z.literal('Vote'), voteSchema]),
])

// export type voteSubject = z.infer<typeof voteSchema>
