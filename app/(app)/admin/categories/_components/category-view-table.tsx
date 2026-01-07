"use client"

import { MoreVertical, Pencil, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"
import { CategoryGamesSheet } from "./category-games-sheet"

interface CategoryViewTableProps {
  categories: CategoryWithGamesDTO[]
  onEdit: (category: CategoryWithGamesDTO) => void
  onDelete: (category: CategoryWithGamesDTO) => void
}

export function CategoryViewTable({ categories, onEdit, onDelete }: CategoryViewTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right w-32">Jogos</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="group">
              <TableCell>
                <div className="size-8 rounded bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FolderOpen className="size-4 text-primary" />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-md">{category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <CategoryGamesSheet category={category} />
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
