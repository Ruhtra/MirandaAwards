import { Role } from '@/prisma/generated/enums'
import { defineAbilityFor } from '../abilities'
import { User } from '@/lib/types'
import { userSchema, UserSubject } from '../subjects/UserSubject'

export const getUserPermision = (userId: string, role: string) => {
  const user: Partial<User> = {
    id: userId,
    role: role as Role,
  }
  const ability = defineAbilityFor(user as User)
  return ability
}

export const mapUserToAuth = (user: UserSubject): UserSubject => {
  return userSchema.parse({ kind: user.kind, id: user.id })
}
