import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Página inicial</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="javascript:history.back()">Voltar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
