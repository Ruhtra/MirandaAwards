import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-primary text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground mt-2">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Página inicial</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="javascript:history.back()">Voltar</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
