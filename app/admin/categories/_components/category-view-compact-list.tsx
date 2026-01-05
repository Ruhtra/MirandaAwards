"use client"

import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import { CategoryGamesSheet } from "./category-games-sheet"

interface CategoryViewCompactListProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewCompactList({ categories, onEdit, onDelete }: CategoryViewCompactListProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const gamesCount = category._count?.games ?? 0
        return (
          <div
            key={category.id}
            className="group flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all"
          >
            {/* Category Icon */}
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{category.name.charAt(0).toUpperCase()}</span>
            </div>

            {/* Category Name - Flexible */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-1">{category.name}</h3>
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
                  className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
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
