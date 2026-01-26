// // abilities.ts
// import { MongoAbility } from '@casl/ability'
// import { Actions } from './types'
// import { Subjects } from './types'

import { User } from '@/lib/types'
import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability'
import z from 'zod'
import { permissions } from './permissions'
import { userSubject } from './subjects/UserSubject'
import { categorySubject } from './subjects/categorySubject'
import { voteSubject } from './subjects/VoteSubject'
import { gameSubject } from './subjects/gameSubject'

// export type AppAbility = MongoAbility<[Actions, Subjects]>

const appAbilities = z.union([
  userSubject,
  categorySubject,
  voteSubject,
  gameSubject,
  // z.tuple([z.literal('manage'), z.literal('f')]),
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilities>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility)

  if (typeof permissions[user.role] == 'function') {
    permissions[user.role](user, builder)
  } else {
    throw new Error(`Type to use unknow role "${user.role}"`)
  }

  const ability = builder.build({
    detectSubjectType(subject: any) {
      return subject.kind || subject.__typename || subject
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
