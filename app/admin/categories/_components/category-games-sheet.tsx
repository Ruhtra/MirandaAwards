"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"

interface CategoryGamesSheetProps {
  category: CategoryWithGamesDTO
}

export function CategoryGamesSheet({ category }: CategoryGamesSheetProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const gamesCount = category._count?.games ?? 0

  const filteredGames = category.games?.filter((game) => game.name.toLowerCase().includes(search.toLowerCase())) ?? []

  if (gamesCount === 0) {
    return (
      <Badge variant="secondary" className="text-xs">
        0 jogos
      </Badge>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex">
          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors">
            {gamesCount} {gamesCount === 1 ? "jogo" : "jogos"}
          </Badge>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-2">
        <SheetHeader className="p-0">
          <SheetTitle>{category.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar jogos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2 pr-4">
              {filteredGames.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum jogo encontrado</p>
              ) : (
                filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    {game.image_url ? (
                      <Image
                        src={game.image_url || "/placeholder.svg"}
                        alt={game.name}
                        width={48}
                        height={48}
                        className="size-12 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="size-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-muted-foreground">{game.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{game.name}</p>
                      <p className="text-xs text-muted-foreground">{/*game.platform*/ 'platform'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
