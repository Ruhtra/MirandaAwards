'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GameFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  publishedFilter: string
  onPublishedChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
}

export function GameFilters({
  searchQuery,
  onSearchChange,
  publishedFilter,
  onPublishedChange,
  categoryFilter,
  onCategoryChange,
}: GameFiltersProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
            <Filter className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status de Publicação</Label>
              <Select value={publishedFilter} onValueChange={onPublishedChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="unpublished">Não Publicados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryFilter} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {/* Categorias serão carregadas dinamicamente */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
