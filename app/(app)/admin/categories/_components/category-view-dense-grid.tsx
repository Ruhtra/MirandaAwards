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

interface CategoryViewDenseGridProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewDenseGrid({
  categories,
  onEdit,
  onDelete,
}: CategoryViewDenseGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="group hover:border-primary/50 h-[100px] py-0 transition-all hover:shadow-md"
        >
          <CardContent className="flex h-full flex-col justify-center p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="from-primary/20 to-accent/20 flex size-8 shrink-0 items-center justify-center rounded bg-gradient-to-br">
                <span className="text-primary text-xs font-bold">
                  {category.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col justify-between">
                <h3
                  className="mb-1 line-clamp-2 text-sm leading-tight font-semibold"
                  title={category.name}
                >
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
                    className="size-7 shrink-0 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
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
