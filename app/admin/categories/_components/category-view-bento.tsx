"use client"

import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import { CategoryGamesSheet } from "./category-games-sheet"
import Image from "next/image"

interface CategoryViewBentoProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewBento({ categories, onEdit, onDelete }: CategoryViewBentoProps) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[120px]">
      {categories.map((category, index) => {
        const gamesCount = category._count?.games ?? 0
        // Alguns cards ocupam mais espaço para criar layout bento interessante
        const isLarge = index % 7 === 0 || index % 11 === 0
        const colSpan = isLarge ? "col-span-2" : "col-span-1"
        const firstGame = category.games?.[0]

        return (
          <Card
            key={category.id}
            className={`group hover:shadow-lg transition-all hover:border-primary/50 relative overflow-hidden py-0 ${colSpan}`}
          >
            {/* Background Image if has games */}
            {firstGame?.image_url && isLarge && (
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <Image src={firstGame.image_url || "/placeholder.svg"} alt="" fill className="object-cover" />
              </div>
            )}

            <CardContent className="p-3 h-full flex flex-col relative z-10">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="text-xs font-bold text-primary">{category.name.charAt(0).toUpperCase()}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0 bg-background/50 backdrop-blur-sm"
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
                    <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
                      <Trash2 className="mr-2 size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-0">
                <h3
                  className={`font-semibold leading-tight mb-1 ${isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}
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
                          <div key={game.id} className="size-6 rounded-full border-2 border-background overflow-hidden">
                            <Image
                              src={game.image_url || "/placeholder.svg"}
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
