"use client"

import { Upload, Gamepad2 } from "lucide-react"
import type { Control } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CategoryDTO } from "@/lib/Dto/gameDTO"
import { CategorySelectorCombobox } from "./category-selector-combobox"

interface GameFormFieldsProps {
    control: Control<any>
    imageUrl?: string
}

export function GameFormFields({ control, imageUrl }: GameFormFieldsProps) {
    const { data: categories = [] } = useQuery<CategoryDTO[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch("/api/categories")
            if (!response.ok) throw new Error("Failed to fetch categories")
            return response.json()
        },
    })

    return (
        <>
            {/* Game Image Upload Section */}
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="relative">
                    <div className="size-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                        <Avatar className="size-full rounded-xl">
                            <AvatarImage src={imageUrl || "/placeholder.svg"} alt="Game cover" />
                            <AvatarFallback className="rounded-xl bg-transparent">
                                <Gamepad2 className="size-12 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 size-8 rounded-full shadow-md"
                    >
                        <Upload className="size-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Clique para adicionar capa</p>
            </div>

            {/* Name Field */}
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Jogo</FormLabel>
                        <FormControl>
                            <Input placeholder="The Last of Us Part II" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Description Field */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Uma jornada épica..."
                                className="resize-none min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Category Selection Field */}
            <FormField
                control={control}
                name="categoryIds"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <CategorySelectorCombobox
                                categories={categories}
                                selectedIds={field.value || []}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Published Status */}
            <FormField
                control={control}
                name="published"
                render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Status de Publicação</label>
                            <p className="text-xs text-muted-foreground">Publicado ou em rascunho</p>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </div>
                )}
            />
        </>
    )
}
