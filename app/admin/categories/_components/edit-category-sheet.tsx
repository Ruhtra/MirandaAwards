"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { UpdateCategoryInput } from "@/lib/validations/category"
import { CategoryFormFields } from "./category-form-fields"
import { CategoryDTO } from "@/lib/Dto/gameDTO"

interface EditCategorySheetProps {
  category: CategoryDTO
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategorySheet({ category, open, onOpenChange }: EditCategorySheetProps) {
  const [name, setName] = useState(category.name)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCategoryInput) => {
      const res = await fetch(`/api/categories/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update category")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({ title: "Categoria atualizada com sucesso" })
      onOpenChange(false)
    },
    onError: () => {
      toast({ title: "Erro ao atualizar categoria", variant: "destructive" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ id: category.id, name })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-2">
        <SheetHeader className="p-0">
          <SheetTitle>Editar Categoria</SheetTitle>
          <SheetDescription>Atualize as informações da categoria</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <CategoryFormFields name={name} onNameChange={setName} />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending || !name.trim()} className="flex-1">
              {updateMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
