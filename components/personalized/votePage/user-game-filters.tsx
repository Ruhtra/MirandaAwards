"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface UserGameFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  pendingOnly: boolean
  onPendingOnlyChange: (value: boolean) => void
}

export function UserGameFilters({ search, onSearchChange, pendingOnly, onPendingOnlyChange }: UserGameFiltersProps) {
  const activeFiltersCount = pendingOnly ? 1 : 0

  const handleClearFilters = () => {
    onSearchChange("")
    onPendingOnlyChange(false)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar jogos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-9 pr-9 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="relative h-10 gap-2 bg-background/50 backdrop-blur-sm border-border/50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-xl font-bold">Filtros</SheetTitle>
            <SheetDescription>Configure os filtros para encontrar jogos específicos</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Pending Only Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status de Votação</Label>
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Votos Pendentes</div>
                  <div className="text-xs text-muted-foreground">Mostrar apenas jogos com votos pendentes</div>
                </div>
                <Switch checked={pendingOnly} onCheckedChange={onPendingOnlyChange} />
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={handleClearFilters} className="w-full gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
