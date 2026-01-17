'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserList } from './_components/user-list'
import { CreateUserSheet } from './_components/create-user-sheet'
import { EditUserSheet } from './_components/edit-user-sheet'
import { PageHeader } from './_components/page-header'
import { UserFilters } from './_components/user-filters'

export default function UsersPage() {
  const [createSheetOpen, setCreateSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const handleCreateUser = () => {
    setCreateSheetOpen(true)
  }

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId)
    setEditSheetOpen(true)
  }

  const handleCloseEditSheet = () => {
    setEditSheetOpen(false)
    setEditingUserId(null)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-none space-y-3 pb-3">
        <PageHeader
          title="Usuários"
          action={
            <Button onClick={handleCreateUser} className="w-full gap-2 md:w-auto">
              <UserPlus className="size-4" />
              <span>Novo Usuário</span>
            </Button>
          }
        />

        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <UserList onEditUser={handleEditUser} searchQuery={searchQuery} roleFilter={roleFilter} />
      </div>

      <CreateUserSheet open={createSheetOpen} onOpenChange={setCreateSheetOpen} />

      {editingUserId && (
        <EditUserSheet
          open={editSheetOpen}
          onOpenChange={handleCloseEditSheet}
          userId={editingUserId}
        />
      )}
    </div>
  )
}
