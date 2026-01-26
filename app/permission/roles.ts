import { z } from 'better-auth'

export const roleSchema = z.union([z.literal('admin'), z.literal('user')])

export type Role = z.infer<typeof roleSchema>
