"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash2, Shield, UserIcon, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { DeleteUserDialog } from "./delete-user-dialog"
import { useState } from "react"
import type { User } from "@/lib/types"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface UserListProps {
  onEditUser: (userId: string) => void
}

export function UserList({ onEditUser }: UserListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Erro ao buscar usuários")
      return response.json()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erro ao deletar usuário")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Usuário deletado",
        description: "O usuário foi removido com sucesso",
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    },
    onError: () => {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o usuário",
        variant: "destructive",
      })
    },
  })

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id)
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-card p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </Card>
    )
  }

  if (!users || users.length === 0) {
    return (
      <Card className="glass-card p-8">
        <Empty>
          <EmptyMedia>
            <UserIcon className="size-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Nenhum usuário cadastrado</EmptyTitle>
            <EmptyDescription>Comece criando seu primeiro usuário do sistema</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card overflow-hidden">
        <ScrollArea className="h-[calc(100vh-280px)] md:h-[calc(100vh-240px)]">
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <UserIcon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Mail className="size-3" />
                          {user.email}
                        </div>
                      </div>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="gap-1">
                        <Shield className="size-3" />
                        {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      Criado em {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEditUser(user.id)}
                      className="hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteClick(user)}
                      className="hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
