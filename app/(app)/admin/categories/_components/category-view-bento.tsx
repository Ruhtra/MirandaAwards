'use client'

import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'
import { CategoryGamesSheet } from './category-games-sheet'
import Image from 'next/image'

interface CategoryViewBentoProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewBento({ categories, onEdit, onDelete }: CategoryViewBentoProps) {
  return (
    <div className="grid auto-rows-[120px] grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {categories.map((category, index) => {
        const gamesCount = category._count?.games ?? 0
        // Alguns cards ocupam mais espaço para criar layout bento interessante
        const isLarge = index % 7 === 0 || index % 11 === 0
        const colSpan = isLarge ? 'col-span-2' : 'col-span-1'
        const firstGame = category.games?.[0]

        return (
          <Card
            key={category.id}
            className={`group hover:border-primary/50 relative overflow-hidden py-0 transition-all hover:shadow-lg ${colSpan}`}
          >
            {/* Background Image if has games */}
            {firstGame?.image_url && isLarge && (
              <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20">
                <Image
                  src={firstGame.image_url || '/placeholder.svg'}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <CardContent className="relative z-10 flex h-full flex-col p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="from-primary/30 to-accent/30 border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg border bg-gradient-to-br backdrop-blur-sm">
                  <span className="text-primary text-xs font-bold">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/50 size-7 shrink-0 opacity-100 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
                    >
                      <MoreVertical className="size-3.5" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Pencil className="mr-2 size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-between">
                <h3
                  className={`mb-1 leading-tight font-semibold ${isLarge ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'}`}
                  title={category.name}
                >
                  {category.name}
                </h3>

                <div className="mt-auto flex items-center gap-2">
                  <CategoryGamesSheet category={category} />
                  {isLarge && gamesCount > 0 && category.games && (
                    <div className="flex -space-x-2">
                      {category.games.slice(0, 3).map((game) =>
                        game.image_url ? (
                          <div
                            key={game.id}
                            className="border-background size-6 overflow-hidden rounded-full border-2"
                          >
                            <Image
                              src={game.image_url || '/placeholder.svg'}
                              alt={game.name}
                              width={24}
                              height={24}
                              className="size-full object-cover"
                            />
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
