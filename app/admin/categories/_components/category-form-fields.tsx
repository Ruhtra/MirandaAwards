"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CategoryFormFieldsProps {
  name: string
  onNameChange: (name: string) => void
}

export function CategoryFormFields({ name, onNameChange }: CategoryFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nome da Categoria</Label>
      <Input
        id="name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ex: Ação, RPG, Estratégia..."
        required
        minLength={2}
        maxLength={50}
      />
    </div>
  )
}
