"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Gamepad2, FolderKanban, Vote } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Adicionar Jogo",
      description: "Cadastrar novo jogo",
      icon: Gamepad2,
      href: "/admin/games",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Adicionar Usuário",
      description: "Criar nova conta",
      icon: Users,
      href: "/admin/users",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Adicionar Categoria",
      description: "Nova categoria de voto",
      icon: FolderKanban,
      href: "/admin/categories",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Votar nos Jogos",
      description: "Acesse a área de votação",
      icon: Vote,
      href: "/admin/voteingames",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center gap-3 p-4 w-full hover:bg-secondary/50 bg-transparent"
                >
                  <div className={`p-3 rounded-lg ${action.bgColor}`}>
                    <Icon className={`size-6 ${action.color}`} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
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
