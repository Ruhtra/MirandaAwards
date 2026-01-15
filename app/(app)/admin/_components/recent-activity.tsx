"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, User, Gamepad2, FolderKanban } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function RecentActivity() {
  // Mock data - em produção, buscar da API
  const activities = [
    {
      id: 1,
      type: "game",
      action: "adicionou o jogo",
      item: "The Legend of Zelda: TOTK",
      user: "Admin",
      time: "há 2 minutos",
      icon: Gamepad2,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "user",
      action: "criou o usuário",
      item: "João Silva",
      user: "Admin",
      time: "há 15 minutos",
      icon: User,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "category",
      action: "editou a categoria",
      item: "Melhor Arte",
      user: "Admin",
      time: "há 1 hora",
      icon: FolderKanban,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "game",
      action: "adicionou o jogo",
      item: "Baldur's Gate 3",
      user: "Admin",
      time: "há 2 horas",
      icon: Gamepad2,
      color: "text-blue-500",
    },
    {
      id: 5,
      type: "user",
      action: "criou o usuário",
      item: "Maria Santos",
      user: "Admin",
      time: "há 3 horas",
      icon: User,
      color: "text-green-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5" />
          Atividades Recentes
        </CardTitle>
        <CardDescription>Últimas ações realizadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-secondary">
                    <Icon className={`size-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                      <span className="font-semibold">{activity.item}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
