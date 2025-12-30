"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserList } from "./_components/user-list"
import { UserSheet } from "./_components/user-sheet"

export default function UsersPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie usuários do sistema Miranda Awards</p>
        </div>
        <Button onClick={handleCreateUser} className="gap-2 glow-primary">
          <UserPlus className="size-4" />
          Novo Usuário
        </Button>
      </div>

      {/* User List */}
      <UserList onEditUser={handleEditUser} />

      {/* Create/Edit Sheet */}
      <UserSheet open={sheetOpen} onOpenChange={handleCloseSheet} userId={editingUserId} />
    </div>
  )
}
