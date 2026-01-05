"use client"

import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import { CategoryGamesSheet } from "./category-games-sheet"

interface CategoryViewDenseGridProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewDenseGrid({ categories, onEdit, onDelete }: CategoryViewDenseGridProps) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {categories.map((category) => (
        <Card key={category.id} className="group hover:shadow-md transition-all hover:border-primary/50 py-0 h-[100px]">
          <CardContent className="p-3 h-full flex flex-col justify-center">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="size-8 rounded bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{category.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-between">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1" title={category.name}>
                  {category.name}
                </h3>
                <div className="mt-auto">
                  <CategoryGamesSheet category={category} />
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
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


          </CardContent>
        </Card>
      ))}
    </div>
  )
}
