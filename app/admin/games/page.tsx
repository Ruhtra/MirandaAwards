import { Gamepad2, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GamesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
              <Gamepad2 className="size-8 text-muted-foreground" />
              <div className="absolute -top-2 -right-2 size-8 rounded-full bg-muted flex items-center justify-center">
                <Lock className="size-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">Gerenciamento de Jogos</CardTitle>
          <CardDescription className="text-base">Em breve disponível</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}
