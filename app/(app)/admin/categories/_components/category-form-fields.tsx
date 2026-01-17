'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface CategoryFormFieldsProps {
  name: string
  description?: string
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
}

export function CategoryFormFields({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: CategoryFormFieldsProps) {
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
      <Input
        id="description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Ex: Categoria destinada ao jogo com melhor estratégia..."
        required
        minLength={10}
        maxLength={250}
      />
    </div>
  )
}
