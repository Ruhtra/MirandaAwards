'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CategoryDTO } from '@/lib/Dto/gameDTO'

interface CategorySelectorComboboxProps {
  categories: CategoryDTO[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
}

export function CategorySelectorCombobox({
  categories,
  selectedIds,
  onChange,
}: CategorySelectorComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id))

  const toggleCategory = (categoryId: string) => {
    const isSelected = selectedIds.includes(categoryId)
    if (isSelected) {
      onChange(selectedIds.filter((id) => id !== categoryId))
    } else {
      onChange([...selectedIds, categoryId])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    onChange(categories.map((cat) => cat.id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Categorias</label>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <Badge variant="secondary" className="font-normal">
                {selectedIds.length} selecionada{selectedIds.length !== 1 && 's'}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 text-xs"
              >
                Limpar
              </Button>
            </>
          )}
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-10 w-full justify-between bg-transparent"
          >
            <div className="flex flex-1 flex-wrap gap-1.5">
              {selectedCategories.length > 0 ? (
                selectedCategories.slice(0, 3).map((cat) => (
                  <Badge key={cat.id} variant="secondary" className="font-normal">
                    {cat.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Selecionar categorias...</span>
              )}
              {selectedCategories.length > 3 && (
                <Badge variant="secondary" className="font-normal">
                  +{selectedCategories.length - 3}
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {/* <div className="flex items-center border-b px-3"> */}
            <CommandInput placeholder="Pesquisar categorias..." />
            {/* </div> */}
            <CommandList>
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedIds.includes(category.id) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border">
          {selectedCategories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="gap-1 pr-1 font-normal">
              {cat.name}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )} */}
    </div>
  )
}
