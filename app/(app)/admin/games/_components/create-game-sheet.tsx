'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { createGameSchema, type CreateGameInput } from '@/lib/validations/game'
import { GameFormFields } from './game-form-fields'

interface CreateGameSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGameSheet({ open, onOpenChange }: CreateGameSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<CreateGameInput>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      name: '',
      description: '',
      published: false,
      categoryIds: [],
    },
  })

  const handleImageChange = useCallback((file: File | null, previewUrl: string | null) => {
    setPendingImageFile(file)
    setImagePreview(previewUrl)
  }, [])

  const createMutation = useMutation({
    mutationFn: async (data: CreateGameInput) => {
      let imageUrl: string | null = null
      let imageFilename: string | null = null

      if (pendingImageFile) {
        const formData = new FormData()
        formData.append('file', pendingImageFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.error || 'Erro ao fazer upload da imagem')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
        imageFilename = uploadData.filename
      }

      // Create game with image data
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          imageUrl,
          imageFilename,
        }),
      })

      if (!response.ok) {
        // If game creation fails and we uploaded an image, delete it
        if (imageUrl) {
          try {
            await fetch('/api/upload', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: imageUrl }),
            })
          } catch {
            // Ignore cleanup errors
          }
        }
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar jogo')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast({
        title: 'Jogo criado',
        description: 'O jogo foi criado com sucesso',
      })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar jogo',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const isLoading = createMutation.isPending

  const handleClose = () => {
    form.reset()
    setPendingImageFile(null)
    setImagePreview(null)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="px-5 pt-5 pb-4">
          <SheetTitle className="text-xl font-semibold">Novo Jogo</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4 px-5 pb-5"
          >
            <GameFormFields
              control={form.control}
              setValue={form.setValue}
              onImageChange={handleImageChange}
              imagePreview={imagePreview}
            />

            <div className="flex gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
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
