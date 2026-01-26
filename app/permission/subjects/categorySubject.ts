import { z } from 'zod'

export const categorySchema = z.object({
  kind: z.literal('Category'),
  id: z.string(),
})

export const categorySubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('list'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Category'), z.literal('CategoryWithGames')]),
])

// export type categorySubject = z.infer<typeof categorySchema>
