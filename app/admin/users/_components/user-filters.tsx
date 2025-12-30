"use client"

import { SlidersHorizontal, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface UserFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleChange: (value: string) => void
}

export function UserFilters({ searchQuery, onSearchChange, roleFilter, onRoleChange }: UserFiltersProps) {
  const hasActiveFilters = searchQuery || roleFilter !== "all"
  const activeFilterCount = [searchQuery, roleFilter !== "all"].filter(Boolean).length

  const handleClearFilters = () => {
    onSearchChange("")
    onRoleChange("all")
  }

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:flex gap-2 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="USER">Usuário</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1.5 h-9">
            <X className="size-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-10 justify-between bg-transparent">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Filtros
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-auto size-5 flex items-center justify-center p-0 rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh]">
            <SheetHeader className="mb-6">
              <SheetTitle>Filtros de Usuários</SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome ou email..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Usuário</label>
                <Select value={roleFilter} onValueChange={onRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Future filters placeholder */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center py-4">
                  Mais filtros serão adicionados em breve
                </p>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters} className="w-full gap-2 mt-6 bg-transparent">
                  <X className="size-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
