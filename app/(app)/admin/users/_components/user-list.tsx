'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Trash2, Shield, UserIcon, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { DeleteUserDialog } from './delete-user-dialog'
import { UserListSkeleton } from './user-list-skeleton'
import { useState, useMemo } from 'react'
import type { User } from '@/lib/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserListProps {
  onEditUser: (userId: string) => void
  searchQuery: string
  roleFilter: string
}

export function UserList({ onEditUser, searchQuery, roleFilter }: UserListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Erro ao buscar usuários')
      return response.json()
    },
  })

  const filteredUsers = useMemo(() => {
    if (!users) return []

    return users.filter((user) => {
      // Search filter (name or email)
      const matchesSearch = searchQuery
        ? user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      // Role filter
      const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erro ao deletar usuário')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuário deletado',
        description: 'O usuário foi removido com sucesso',
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    },
    onError: () => {
      toast({
        title: 'Erro ao deletar',
        description: 'Não foi possível deletar o usuário',
        variant: 'destructive',
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
    return <UserListSkeleton />
  }

  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <Card className="glass-card p-8">
        <Empty>
          <EmptyMedia>
            <UserIcon className="text-muted-foreground size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {searchQuery || roleFilter !== 'all'
                ? 'Nenhum usuário encontrado'
                : 'Nenhum usuário cadastrado'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery || roleFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro usuário do sistema'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card h-full overflow-hidden py-0">
        <ScrollArea className="h-full">
          <div className="divide-border divide-y">
            {filteredUsers.map((user) => (
              <div key={user.id} className="hover:bg-accent/30 p-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="from-primary/20 to-accent/20 flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                    <UserIcon className="text-primary size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                  </div>

                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className="flex-shrink-0 gap-1"
                  >
                    <Shield className="size-3" />
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="flex-shrink-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        <Edit className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="size-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
        userName={userToDelete?.name || ''}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
