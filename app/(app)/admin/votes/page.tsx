import { Vote, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VotesPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="glass-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="from-primary/20 to-accent/20 relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br">
              <Vote className="text-muted-foreground size-8" />
              <div className="bg-muted absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full">
                <Lock className="text-muted-foreground size-4" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">Gerenciamento de Votos</CardTitle>
          <CardDescription className="text-base">Em breve disponível</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center">
          <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}
