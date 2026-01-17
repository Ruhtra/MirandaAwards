'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'
import { UserFormFields } from './user-form-fields'

interface CreateUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserSheet({ open, onOpenChange }: CreateUserSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar usuário')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuário criado',
        description: 'O usuário foi criado com sucesso',
      })
      onOpenChange(false)
      form.reset()
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const isLoading = createMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="px-5 pt-5 pb-4">
          <SheetTitle className="text-xl font-semibold">Novo Usuário</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4 px-5 pb-5"
          >
            <UserFormFields control={form.control} />

            <div className="flex gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isLoading}
              >
                <X className="mr-1.5 size-4" />
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-1.5 size-4" />
                    Salvando...
                  </>
                ) : (
                  <>Criar Usuário</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
