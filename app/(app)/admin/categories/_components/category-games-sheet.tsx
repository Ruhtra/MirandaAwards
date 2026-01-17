'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Image from 'next/image'
import type { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'

interface CategoryGamesSheetProps {
  category: CategoryWithGamesDTO
}

export function CategoryGamesSheet({ category }: CategoryGamesSheetProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const gamesCount = category._count?.games ?? 0

  const filteredGames =
    category.games?.filter((game) => game.name.toLowerCase().includes(search.toLowerCase())) ?? []

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
          <Badge
            variant="secondary"
            className="hover:bg-secondary/80 cursor-pointer text-xs transition-colors"
          >
            {gamesCount} {gamesCount === 1 ? 'jogo' : 'jogos'}
          </Badge>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full p-2 sm:max-w-md">
        <SheetHeader className="p-0">
          <SheetTitle>{category.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Nenhum jogo encontrado
                </p>
              ) : (
                filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-card hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    {game.image_url ? (
                      <Image
                        src={game.image_url || '/placeholder.svg'}
                        alt={game.name}
                        width={48}
                        height={48}
                        className="size-12 flex-shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex size-12 flex-shrink-0 items-center justify-center rounded">
                        <span className="text-muted-foreground text-sm font-medium">
                          {game.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{game.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {/*game.platform*/ 'platform'}
                      </p>
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
