'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, LayoutGrid, List, Table2, Layers, Grid3x3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryFilters } from './category-filters'
import { CreateCategorySheet } from './create-category-sheet'
import { EditCategorySheet } from './edit-category-sheet'
import { DeleteCategoryDialog } from './delete-category-dialog'
import type { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'
import { useToast } from '@/hooks/use-toast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CategoryViewCompactList } from './category-view-compact-list'
import { CategoryViewTable } from './category-view-table'
import { CategoryViewDenseGrid } from './category-view-dense-grid'
import { CategoryViewAccordion } from './category-view-accordion'
import { CategoryViewBento } from './category-view-bento'

type ViewMode = 'bento' | 'dense-grid' | 'list' | 'table' | 'accordion'

export function CategoryGrid() {
  const [search, setSearch] = useState('')
  const [minGames, setMinGames] = useState('')
  const [maxGames, setMaxGames] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryWithGamesDTO | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithGamesDTO | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('bento')

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: categories = [], isLoading } = useQuery<CategoryWithGamesDTO[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories/withGames')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Failed to delete category')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({ title: 'Categoria excluída com sucesso' })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir categoria, err: ' + error.message, variant: 'destructive' })
    },
  })

  const handleDeleteClick = (category: CategoryWithGamesDTO) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id)
    }
  }

  const handleClearFilters = () => {
    setMinGames('')
    setMaxGames('')
  }

  const filteredCategories = categories.filter((category) => {
    if (search && !category.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }

    const gamesCount = category._count?.games ?? 0

    if (minGames && gamesCount < Number.parseInt(minGames)) {
      return false
    }

    if (maxGames && gamesCount > Number.parseInt(maxGames)) {
      return false
    }

    return true
  })

  if (isLoading) {
    return <div className="text-muted-foreground py-12 text-center">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex-1">
          <CategoryFilters
            search={search}
            onSearchChange={setSearch}
            minGames={minGames}
            maxGames={maxGames}
            onMinGamesChange={setMinGames}
            onMaxGamesChange={setMaxGames}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            className="hidden md:flex"
          >
            <ToggleGroupItem value="bento" aria-label="Bento Grid" size="sm">
              <LayoutGrid className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dense-grid" aria-label="Dense Grid" size="sm">
              <Grid3x3 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Compact List" size="sm">
              <List className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table" size="sm">
              <Table2 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="accordion" aria-label="Accordion" size="sm">
              <Layers className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={() => setCreateOpen(true)} className="w-full shrink-0 sm:w-auto">
            <Plus className="mr-2 size-4" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {search || minGames || maxGames
            ? 'Nenhuma categoria encontrada com os filtros aplicados'
            : 'Nenhuma categoria cadastrada'}
        </div>
      ) : (
        <>
          {viewMode === 'bento' && (
            <CategoryViewBento
              categories={filteredCategories}
              onEdit={setEditCategory}
              onDelete={handleDeleteClick}
            />
          )}
          {viewMode === 'dense-grid' && (
            <CategoryViewDenseGrid
              categories={filteredCategories}
              onEdit={setEditCategory}
              onDelete={handleDeleteClick}
            />
          )}
          {viewMode === 'list' && (
            <CategoryViewCompactList
              categories={filteredCategories}
              onEdit={setEditCategory}
              onDelete={handleDeleteClick}
            />
          )}
          {viewMode === 'table' && (
            <CategoryViewTable
              categories={filteredCategories}
              onEdit={setEditCategory}
              onDelete={handleDeleteClick}
            />
          )}
          {viewMode === 'accordion' && (
            <CategoryViewAccordion
              categories={filteredCategories}
              onEdit={setEditCategory}
              onDelete={handleDeleteClick}
            />
          )}
        </>
      )}

      <CreateCategorySheet open={createOpen} onOpenChange={setCreateOpen} />
      {editCategory && (
        <EditCategorySheet
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
        />
      )}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ''}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
