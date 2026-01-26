import { User } from '@/lib/types'
import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from './abilities'
import { Role } from './roles'

type permissions = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record</*Role*/ string, permissions> = {
  admin(user, { can, cannot }) {
    can('manage', 'User')
    can('manage', 'Category')
    can('manage', 'CategoryWithGames')
    can('manage', 'Vote')
    can('manage', 'Game')
    can('manage', 'GameWithVote')
  },
  user(user, { can, cannot }) {
    can('get', 'User', { id: user.id })
    can('update', 'User', { id: user.id })

    can('list', 'Category')
    can('list', 'CategoryWithGames')

    // can('list', 'Vote', {id: user.id})
    can('create', 'Vote')
    can('update', 'Vote', { id: user.id })

    can('list', 'Game')
    can('list', 'GameWithVote')
  },
}
