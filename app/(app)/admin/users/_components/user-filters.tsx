'use client'

import { SlidersHorizontal, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface UserFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleChange: (value: string) => void
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
}: UserFiltersProps) {
  const hasActiveFilters = searchQuery || roleFilter !== 'all'
  const activeFilterCount = [searchQuery, roleFilter !== 'all'].filter(Boolean).length

  const handleClearFilters = () => {
    onSearchChange('')
    onRoleChange('all')
  }

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9 gap-1.5">
            <X className="size-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="space-y-2 md:hidden">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 w-full justify-between bg-transparent">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Filtros Avançados
              </span>
              {roleFilter !== 'all' && (
                <Badge
                  variant="secondary"
                  className="ml-auto flex size-5 items-center justify-center rounded-full p-0"
                >
                  1
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90svh]">
            <div className="flex h-full flex-col px-3 py-3">
              <SheetHeader className="mb-3 p-0">
                <SheetTitle>Filtros de Usuários</SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-4">
                {/* Role Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Usuário</label>
                  <Select value={roleFilter} onValueChange={onRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Future filters placeholder */}
                <div className="border-t pt-4">
                  <p className="text-muted-foreground py-4 text-center text-xs">
                    Mais filtros serão adicionados em breve
                  </p>
                </div>
              </div>

              {/* Clear Filters Button */}
              {roleFilter !== 'all' && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full gap-2 bg-transparent"
                >
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
