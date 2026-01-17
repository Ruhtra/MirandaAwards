'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface CategoryFiltersProps {
  search: string
  onSearchChange: (search: string) => void
  minGames: string
  maxGames: string
  onMinGamesChange: (value: string) => void
  onMaxGamesChange: (value: string) => void
  onClearFilters: () => void
}

export function CategoryFilters({
  search,
  onSearchChange,
  minGames,
  maxGames,
  onMinGamesChange,
  onMaxGamesChange,
  onClearFilters,
}: CategoryFiltersProps) {
  const [open, setOpen] = useState(false)

  const activeFiltersCount = [minGames, maxGames].filter(Boolean).length

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar categorias..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative shrink-0 bg-transparent">
            <SlidersHorizontal className="size-4" />
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full p-2 sm:max-w-md">
          <SheetHeader className="p-0">
            <SheetTitle>Filtros Avançados</SheetTitle>
            <SheetDescription>Refine sua busca por categorias</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <Label>Quantidade de Jogos</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="minGames" className="text-muted-foreground text-xs">
                    Mínimo
                  </Label>
                  <Input
                    id="minGames"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minGames}
                    onChange={(e) => onMinGamesChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGames" className="text-muted-foreground text-xs">
                    Máximo
                  </Label>
                  <Input
                    id="maxGames"
                    type="number"
                    min="0"
                    placeholder="Sem limite"
                    value={maxGames}
                    onChange={(e) => onMaxGamesChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  onClearFilters()
                  setOpen(false)
                }}
              >
                <X className="mr-2 size-4" />
                Limpar Filtros ({activeFiltersCount})
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
