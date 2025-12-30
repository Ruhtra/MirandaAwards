"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { createUserSchema, type CreateUserInput } from "@/lib/validations/user"
import type { User } from "@/lib/types"

interface UserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function UserSheet({ open, onOpenChange, userId }: UserSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditing = !!userId

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  })

  // Fetch user data for editing
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error("Erro ao buscar usuário")
      return response.json()
    },
    enabled: isEditing && open,
  })

  useEffect(() => {
    if (!isLoadingUser && user && isEditing) {
      form.reset({
        name: user.name || "",
        email: user.email,
        password: "",
        role: user.role,
      })
    } else if (!isEditing) {
      form.reset({
        name: "",
        email: "",
        password: "",
        role: "USER",
      })
    }
  }, [user, isEditing, form, isLoadingUser])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar usuário")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso",
      })
      onOpenChange(false)
      form.reset()
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  const onSubmit = (data: CreateUserInput) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        <SheetHeader className="px-5 pt-5 pb-4">
          <SheetTitle className="text-xl font-semibold">{isEditing ? "Editar Usuário" : "Novo Usuário"}</SheetTitle>
        </SheetHeader>

        {isLoadingUser ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 pb-5 space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="relative">
                  <div className="size-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <Avatar className="size-full rounded-xl">
                      <AvatarImage src={/* user?.avatar */ false || "/placeholder.svg"} alt="User avatar" />
                      <AvatarFallback className="rounded-xl bg-transparent">
                        <UserCircle className="size-12 text-muted-foreground" />
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
                <p className="text-xs text-muted-foreground">Clique para adicionar foto</p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isEditing ? "Deixe em branco para manter" : "••••••••"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">Usuário</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Status do Usuário</label>
                  <p className="text-xs text-muted-foreground">Ativo ou inativo no sistema</p>
                </div>
                <Switch defaultChecked />
              </div>

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
                    <>{isEditing ? "Atualizar" : "Criar"} Usuário</>
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
