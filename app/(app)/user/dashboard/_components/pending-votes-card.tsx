import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

export function PendingVotesCard() {
  // Mock data - substituir por dados reais da API
  const pendingGames = [
    {
      id: "1",
      name: "The Legend of Zelda: Tears of the Kingdom",
      image_url: "/heroic-elf-princess.png",
      pendingCategories: 8,
    },
    {
      id: "2",
      name: "Baldur's Gate 3",
      image_url: "/baldurs-gate.jpg",
      pendingCategories: 5,
    },
    {
      id: "3",
      name: "Spider-Man 2",
      image_url: "/spiderman.jpg",
      pendingCategories: 8,
    },
  ];

  if (pendingGames.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Votos Pendentes
          </CardTitle>
          <CardDescription>
            Você não tem votos pendentes no momento
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Votos Pendentes
            </CardTitle>
            <CardDescription>Jogos aguardando suas votações</CardDescription>
          </div>
          <Link href="/user/games?filter=pending">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingGames.map((game) => (
            <Link key={game.id} href={`/games?vote=${game.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="relative size-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={game.image_url || "/placeholder.svg"}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {game.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {game.pendingCategories} categorias pendentes
                  </p>
                </div>
                <Badge variant="destructive" className="flex-shrink-0">
                  {game.pendingCategories}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
