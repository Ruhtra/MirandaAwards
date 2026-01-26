import { z } from 'zod'

export const userSchema = z.object({
  kind: z.literal('User'),
  id: z.string(),
})

export const userSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('list'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('User'), userSchema]),
])

export type UserSubject = z.infer<typeof userSchema>
