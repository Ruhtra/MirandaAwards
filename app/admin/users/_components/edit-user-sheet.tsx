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
import { updateUserSchema, type UpdateUserInput } from "@/lib/validations/user"
import type { User } from "@/lib/types"
import { UserFormFields } from "./user-form-fields"

interface EditUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function EditUserSheet({ open, onOpenChange, userId }: EditUserSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: null,
      role: "USER",
    },
  })

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error("Erro ao buscar usuário")
      return response.json()
    },
    enabled: open && !!userId,
  })

  // Reset form when user data is loaded
  useEffect(() => {
    if (!isLoadingUser && user) {
      form.reset({
        name: user.name || "",
        email: user.email,
        password: null,
        role: user.role,
      })
    }
  }, [user, form, isLoadingUser])

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      const payload = { ...data }
      if (!payload.password) {
        delete payload.password
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar usuário")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
      toast({
        title: "Usuário atualizado",
        description: "O usuário foi atualizado com sucesso",
      })
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar usuário",
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
          <SheetTitle className="text-xl font-semibold">Editar Usuário</SheetTitle>
        </SheetHeader>

        {isLoadingUser ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="px-5 pb-5 space-y-4">
              <UserFormFields
                control={form.control}
                avatarUrl={user?.avatar}
                passwordLabel="Nova Senha (opcional)"
                passwordPlaceholder="Deixe em branco para manter"
              />

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
                    <>Atualizar Usuário</>
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
