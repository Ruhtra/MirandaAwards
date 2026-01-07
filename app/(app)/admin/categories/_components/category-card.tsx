"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Trash2, FolderOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import Image from "next/image"
import { CategoryGamesSheet } from "./category-games-sheet"

interface CategoryCardProps {
  category: CategoryWithGamesDTO
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (cateogry: CategoryWithGamesDTO) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const gamesCount = category._count?.games ?? 0

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/50 p-0 py-0">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <CollapsibleTrigger asChild>
              <button className="flex-1 text-left group/trigger">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <FolderOpen className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight group-hover/trigger:text-primary transition-colors truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">

                      <CategoryGamesSheet category={category} />



                    </div>
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>

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
        </CardContent>
      </Collapsible>
    </Card>
  )
}
