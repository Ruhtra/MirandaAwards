import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export function RecentActivity() {
  // Mock data - substituir por dados reais da API
  const activities = [
    {
      id: '1',
      action: 'Votou em',
      game: 'The Game Awards 2024',
      category: 'Melhor Jogo do Ano',
      score: 9,
      time: '2 horas atrás',
    },
    {
      id: '2',
      action: 'Atualizou voto em',
      game: 'Elden Ring',
      category: 'Melhor Arte',
      score: 10,
      time: '5 horas atrás',
    },
    {
      id: '3',
      action: 'Votou em',
      game: 'God of War Ragnarök',
      category: 'Melhor Narrativa',
      score: 10,
      time: '1 dia atrás',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5" />
          Atividade Recente
        </CardTitle>
        <CardDescription>Suas últimas votações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id}>
              {index > 0 && <div className="bg-border mb-4 h-px" />}
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.game}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">{activity.category}</p>
                  <p className="text-muted-foreground text-xs">{activity.time}</p>
                </div>
                <div className="bg-primary/10 text-primary flex size-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {activity.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
