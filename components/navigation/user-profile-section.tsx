'use client'

import { useState } from 'react'
import { Settings, LogOut, UserIcon, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { SettingsDialog } from './settings-dialog'
import { redirect } from 'next/navigation'

interface UserProfileSectionProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Mock user data - replace with real user data
  const currentUser = user || {
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    role: 'ADMIN',
  }

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    redirect('/logout')
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      USER: 'Usuário',
      MODERATOR: 'Moderador',
    }
    return labels[role] || role
  }

  const getRoleVariant = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      ADMIN: 'default',
      USER: 'secondary',
      MODERATOR: 'outline',
    }
    return variants[role] || 'secondary'
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-secondary/50 h-auto w-full justify-between gap-2 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="from-primary/10 to-accent/10 size-9 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br">
                <Avatar className="size-full rounded-lg">
                  <AvatarImage
                    src={currentUser.avatar || '/placeholder.svg'}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="text-primary rounded-lg bg-transparent text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1 overflow-hidden text-left">
                <p className="text-foreground truncate text-sm leading-tight font-medium">
                  {currentUser.name}
                </p>
                <p className="text-muted-foreground truncate text-xs leading-tight">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground size-3.5 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2.5">
              <div className="from-primary/10 to-accent/10 size-10 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br">
                <Avatar className="size-full rounded-lg">
                  <AvatarImage
                    src={currentUser.avatar || '/placeholder.svg'}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="text-primary rounded-lg bg-transparent font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{currentUser.name}</p>
                <p className="text-muted-foreground mb-1 truncate text-xs">{currentUser.email}</p>
                <Badge
                  variant={getRoleVariant(currentUser.role)}
                  className="h-4 px-1.5 text-[10px]"
                >
                  {getRoleLabel(currentUser.role)}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // Navigate to profile page
            }}
            className="cursor-pointer"
          >
            <UserIcon className="mr-2 size-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="mr-2 size-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
