"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserList } from "./_components/user-list"
import { UserSheet } from "./_components/user-sheet"
import { PageHeader } from "./_components/page-header"
import { UserFilters } from "./_components/user-filters"

export default function UsersPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const handleCreateUser = () => {
    setEditingUserId(null)
    setSheetOpen(true)
  }

  const handleEditUser = (userId: string) => {
    setEditingUserId(userId)
    setSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setSheetOpen(false)
    setEditingUserId(null)
  }

  return (

    <div className="space-y-4">
      <PageHeader
        title="Usuários"
        action={
          <Button onClick={handleCreateUser} className="w-full md:w-auto gap-2">
            <UserPlus className="size-4" />
            <span className="md:inline">Novo Usuário</span>
          </Button>
        }
      />

      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
      />

      <UserList onEditUser={handleEditUser} searchQuery={searchQuery} roleFilter={roleFilter} />


      <UserSheet open={sheetOpen} onOpenChange={handleCloseSheet} userId={editingUserId} />
    </div>
  )
}
