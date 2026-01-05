"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { updateGameSchema, type UpdateGameInput } from "@/lib/validations/game"
import type { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO"
import { GameFormFields } from "./game-form-fields"

interface EditGameSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    gameId: string
}

export function EditGameSheet({ open, onOpenChange, gameId }: EditGameSheetProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const form = useForm<UpdateGameInput>({
        resolver: zodResolver(updateGameSchema),
        defaultValues: {
            name: "",
            description: "",
            published: false,
            categoryIds: [],
        },
    })

    // Fetch game data
    const { data: game, isLoading: isLoadingGame } = useQuery<GameWithCategoriesDTO>({
        queryKey: ["game", gameId],
        queryFn: async () => {
            const response = await fetch(`/api/games/${gameId}`)
            if (!response.ok) throw new Error("Erro ao buscar jogo")
            return response.json()
        },
        enabled: open && !!gameId,
    })

    // Reset form when game data is loaded
    useEffect(() => {
        if (!isLoadingGame && game) {
            form.reset({
                name: game.name,
                description: game.description || "",
                published: game.published,
                categoryIds: game.categories?.map((cat) => cat.id) || [],
            })
        }
    }, [game, form, isLoadingGame])

    const updateMutation = useMutation({
        mutationFn: async (data: UpdateGameInput) => {
            const response = await fetch(`/api/games/${gameId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Erro ao atualizar jogo")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            queryClient.invalidateQueries({ queryKey: ["game", gameId] })
            toast({
                title: "Jogo atualizado",
                description: "O jogo foi atualizado com sucesso",
            })
            onOpenChange(false)
        },
        onError: (error: Error) => {
            toast({
                title: "Erro ao atualizar jogo",
                description: error.message,
                variant: "destructive",
            })
        },
    })

    const isLoading = updateMutation.isPending

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
                <SheetHeader className="px-5 pt-5 pb-4">
                    <SheetTitle className="text-xl font-semibold">Editar Jogo</SheetTitle>
                </SheetHeader>

                {isLoadingGame ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner className="size-8 text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="px-5 pb-5 space-y-4">
                            <GameFormFields control={form.control} imageUrl={game?.image_url || ""} />

                            <div className="flex gap-2.5 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1"
                                    disabled={isLoading}
                                >
                                    <X className="size-4 mr-1.5" />
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Spinner className="size-4 mr-1.5" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>Atualizar Jogo</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </SheetContent>
        </Sheet>
    )
}
