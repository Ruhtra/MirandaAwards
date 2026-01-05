"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { createGameSchema, type CreateGameInput } from "@/lib/validations/game"
import { GameFormFields } from "./game-form-fields"

interface CreateGameSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateGameSheet({ open, onOpenChange }: CreateGameSheetProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const form = useForm<CreateGameInput>({
        resolver: zodResolver(createGameSchema),
        defaultValues: {
            name: "",
            description: "",
            published: false,
            categoryIds: [],
        },
    })

    const createMutation = useMutation({
        mutationFn: async (data: CreateGameInput) => {
            const response = await fetch("/api/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Erro ao criar jogo")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            toast({
                title: "Jogo criado",
                description: "O jogo foi criado com sucesso",
            })
            onOpenChange(false)
            form.reset()
        },
        onError: (error: Error) => {
            toast({
                title: "Erro ao criar jogo",
                description: error.message,
                variant: "destructive",
            })
        },
    })

    const isLoading = createMutation.isPending

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
                <SheetHeader className="px-5 pt-5 pb-4">
                    <SheetTitle className="text-xl font-semibold">Novo Jogo</SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="px-5 pb-5 space-y-4">
                        <GameFormFields control={form.control} />

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
                                    <>Criar Jogo</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
