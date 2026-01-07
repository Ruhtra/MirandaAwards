import { Card } from "@/components/ui/card"
import { Gamepad2, CheckCircle2, Clock, Award } from "lucide-react"

export function StatsCards() {
  // Mock data - substituir por dados reais da API
  const stats = [
    {
      title: "Total de Jogos",
      value: "24",
      icon: Gamepad2,
      description: "Jogos disponíveis",
    },
    {
      title: "Votos Completos",
      value: "18",
      icon: CheckCircle2,
      description: "Jogos votados",
    },
    {
      title: "Votos Pendentes",
      value: "6",
      icon: Clock,
      description: "Aguardando voto",
      highlight: true,
    },
    {
      title: "Categorias",
      value: "8",
      icon: Award,
      description: "Por jogo",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`p-4 space-y-2 ${stat.highlight ? "border-destructive/50 bg-destructive/5" : ""}`}
          >
            <div className="flex items-center justify-between">
              <Icon className={`size-5 ${stat.highlight ? "text-destructive" : "text-muted-foreground"}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${stat.highlight ? "text-destructive" : ""}`}>{stat.value}</p>
              <p className="text-xs font-medium">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
