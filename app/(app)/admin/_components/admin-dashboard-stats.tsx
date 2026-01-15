"use client"

import { Card } from "@/components/ui/card"
import { Gamepad2, Users, FolderKanban, TrendingUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminDashboardStats() {
  // Mock data - em produção, buscar da API
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Simular chamada API
      return {
        totalGames: 42,
        totalUsers: 128,
        totalCategories: 12,
        totalVotes: 1456,
        gamesGrowth: "+12%",
        usersGrowth: "+8%",
        categoriesGrowth: "+2",
        votesGrowth: "+24%",
      }
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Total de Jogos",
      value: stats?.totalGames || 0,
      icon: Gamepad2,
      growth: stats?.gamesGrowth,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      growth: stats?.usersGrowth,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Categorias",
      value: stats?.totalCategories || 0,
      icon: FolderKanban,
      growth: stats?.categoriesGrowth,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total de Votos",
      value: stats?.totalVotes || 0,
      icon: TrendingUp,
      growth: stats?.votesGrowth,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`size-5 ${stat.color}`} />
              </div>
              {stat.growth && (
                <span className="text-xs font-medium text-green-600 dark:text-green-400">{stat.growth}</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
