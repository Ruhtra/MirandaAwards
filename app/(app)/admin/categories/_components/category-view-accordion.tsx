"use client"

import { ChevronDown, Pencil, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import { useState } from "react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryViewAccordionProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewAccordion({ categories, onEdit, onDelete }: CategoryViewAccordionProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const isOpen = openCategories.has(category.id)
        const gamesCount = category._count?.games ?? 0

        return (
          <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
            <div className="rounded-lg border bg-card overflow-hidden hover:border-primary/50 transition-colors">
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 shrink-0">
                    <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>

                <div className="size-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <FolderOpen className="size-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gamesCount} {gamesCount === 1 ? "jogo" : "jogos"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(category)}>
                    <Pencil className="size-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>

              {/* Expandable Content */}
              <CollapsibleContent>
                <div className="border-t bg-muted/30 p-4">
                  {gamesCount === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum jogo associado</p>
                  ) : (
                    <ScrollArea className="max-h-[300px]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pr-4">
                        {category.games?.map((game) => (
                          <div
                            key={game.id}
                            className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            {game.image_url ? (
                              <Image
                                src={game.image_url || "/placeholder.svg"}
                                alt={game.name}
                                width={32}
                                height={32}
                                className="size-8 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="size-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-muted-foreground">{game.name.charAt(0)}</span>
                              </div>
                            )}
                            <span className="text-xs flex-1 truncate" title={game.name}>
                              {game.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}
    </div>
  )
}
