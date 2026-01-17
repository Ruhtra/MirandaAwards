'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Gamepad2, FolderKanban, Vote } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    {
      title: 'Adicionar Jogo',
      description: 'Cadastrar novo jogo',
      icon: Gamepad2,
      href: '/admin/games',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Adicionar Usuário',
      description: 'Criar nova conta',
      icon: Users,
      href: '/admin/users',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Adicionar Categoria',
      description: 'Nova categoria de voto',
      icon: FolderKanban,
      href: '/admin/categories',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Votar nos Jogos',
      description: 'Acesse a área de votação',
      icon: Vote,
      href: '/admin/voteingames',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="size-5" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="hover:bg-secondary/50 flex h-auto w-full flex-col items-center gap-3 bg-transparent p-4"
                >
                  <div className={`rounded-lg p-3 ${action.bgColor}`}>
                    <Icon className={`size-6 ${action.color}`} />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="text-muted-foreground text-xs">{action.description}</p>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
