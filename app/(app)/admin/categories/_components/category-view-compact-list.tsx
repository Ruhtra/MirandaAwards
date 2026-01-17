'use client'

import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'
import { CategoryGamesSheet } from './category-games-sheet'

interface CategoryViewCompactListProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewCompactList({
  categories,
  onEdit,
  onDelete,
}: CategoryViewCompactListProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const gamesCount = category._count?.games ?? 0
        return (
          <div
            key={category.id}
            className="group bg-card hover:bg-accent/50 hover:border-primary/50 flex items-center gap-3 rounded-lg border p-4 transition-all"
          >
            {/* Category Icon */}
            <div className="from-primary/20 to-accent/20 flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-primary text-sm font-bold">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Category Name - Flexible */}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-sm leading-tight font-semibold">{category.name}</h3>
            </div>

            {/* Games Count Badge */}
            <div className="shrink-0">
              <CategoryGamesSheet category={category} />
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                >
                  <MoreVertical className="size-4" />
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
        )
      })}
    </div>
  )
}
