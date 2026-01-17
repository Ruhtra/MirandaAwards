'use client'

import { ChevronDown, Pencil, Trash2, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'
import { useState } from 'react'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CategoryViewAccordionProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewAccordion({
  categories,
  onEdit,
  onDelete,
}: CategoryViewAccordionProps) {
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
          <Collapsible
            key={category.id}
            open={isOpen}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <div className="bg-card hover:border-primary/50 overflow-hidden rounded-lg border transition-colors">
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 shrink-0">
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>

                <div className="from-primary/20 to-accent/20 flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                  <FolderOpen className="text-primary size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm leading-tight font-semibold">{category.name}</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {gamesCount} {gamesCount === 1 ? 'jogo' : 'jogos'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive size-8"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>

              {/* Expandable Content */}
              <CollapsibleContent>
                <div className="bg-muted/30 border-t p-4">
                  {gamesCount === 0 ? (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      Nenhum jogo associado
                    </p>
                  ) : (
                    <ScrollArea className="max-h-[300px]">
                      <div className="grid grid-cols-2 gap-2 pr-4 sm:grid-cols-3 lg:grid-cols-4">
                        {category.games?.map((game) => (
                          <div
                            key={game.id}
                            className="bg-card hover:bg-accent/50 flex items-center gap-2 rounded-lg border p-2 transition-colors"
                          >
                            {game.image_url ? (
                              <Image
                                src={game.image_url || '/placeholder.svg'}
                                alt={game.name}
                                width={32}
                                height={32}
                                className="size-8 flex-shrink-0 rounded object-cover"
                              />
                            ) : (
                              <div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded">
                                <span className="text-muted-foreground text-xs font-medium">
                                  {game.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="flex-1 truncate text-xs" title={game.name}>
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
