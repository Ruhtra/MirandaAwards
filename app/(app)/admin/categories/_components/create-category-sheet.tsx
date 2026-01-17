'use client'

import type React from 'react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { CreateCategoryInput } from '@/lib/validations/category'
import { CategoryFormFields } from './category-form-fields'

interface CreateCategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategorySheet({ open, onOpenChange }: CreateCategorySheetProps) {
  const [name, setName] = useState('')
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create category')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({ title: 'Categoria criada com sucesso' })
      setName('')
      onOpenChange(false)
    },
    onError: () => {
      toast({ title: 'Erro ao criar categoria', variant: 'destructive' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ name })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full p-2 sm:max-w-md">
        <SheetHeader className="p-0">
          <SheetTitle>Nova Categoria</SheetTitle>
          <SheetDescription>Adicione uma nova categoria ao sistema</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <CategoryFormFields name={name} onNameChange={setName} />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className="flex-1"
            >
              {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Criar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
