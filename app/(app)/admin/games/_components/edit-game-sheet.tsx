'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { updateGameSchema, type UpdateGameInput } from '@/lib/validations/game'
import type { GameWithCategoriesDTO } from '@/lib/Dto/gameDTO'
import { GameFormFields } from './game-form-fields'

interface EditGameSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameId: string
}

export function EditGameSheet({ open, onOpenChange, gameId }: EditGameSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const originalImageUrl = useRef<string | null>(null)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)

  const form = useForm<UpdateGameInput>({
    resolver: zodResolver(updateGameSchema),
    defaultValues: {
      name: '',
      description: '',
      published: false,
      categoryIds: [],
    },
  })

  // Fetch game data
  const { data: game, isLoading: isLoadingGame } = useQuery<GameWithCategoriesDTO>({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const response = await fetch(`/api/games/${gameId}`)
      if (!response.ok) throw new Error('Erro ao buscar jogo')
      return response.json()
    },
    enabled: open && !!gameId,
  })

  // Reset form when game data is loaded
  useEffect(() => {
    if (!isLoadingGame && game) {
      originalImageUrl.current = game.image_url || null
      form.reset({
        name: game.name,
        description: game.description || '',
        published: game.published,
        categoryIds: game.categories?.map((cat) => cat.id) || [],
      })
      // Reset image state
      setPendingImageFile(null)
      setImagePreview(null)
      setImageRemoved(false)
    }
  }, [game, form, isLoadingGame])

  const handleImageChange = useCallback((file: File | null, previewUrl: string | null) => {
    if (file) {
      // New image selected
      setPendingImageFile(file)
      setImagePreview(previewUrl)
      setImageRemoved(false)
    } else {
      // Image removed
      setPendingImageFile(null)
      setImagePreview(null)
      setImageRemoved(true)
    }
  }, [])

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateGameInput) => {
      let imageUrl: string | null = null
      let imageFilename: string | null = null
      let shouldDeleteOldImage = false

      // Case 1: New image file selected - upload it
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
        shouldDeleteOldImage = !!originalImageUrl.current
      }
      // Case 2: Image was removed
      else if (imageRemoved) {
        imageUrl = null
        imageFilename = null
        shouldDeleteOldImage = !!originalImageUrl.current
      }
      // Case 3: No change to image - keep existing
      else {
        imageUrl = originalImageUrl.current
        imageFilename = game?.image_filename || null
      }

      // Update game
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          imageUrl,
          imageFilename,
          imageRemoved,
          oldImageUrl: shouldDeleteOldImage ? originalImageUrl.current : null,
        }),
      })

      if (!response.ok) {
        // If update fails and we uploaded a new image, delete it
        if (pendingImageFile && imageUrl) {
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
        throw new Error(error.error || 'Erro ao atualizar jogo')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['game', gameId] })
      toast({
        title: 'Jogo atualizado',
        description: 'O jogo foi atualizado com sucesso',
      })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar jogo',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const isLoading = updateMutation.isPending

  const handleClose = () => {
    form.reset()
    setPendingImageFile(null)
    setImagePreview(null)
    setImageRemoved(false)
    onOpenChange(false)
  }

  const currentImageUrl = imageRemoved ? null : imagePreview ? null : game?.image_url

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="px-5 pt-5 pb-4">
          <SheetTitle className="text-xl font-semibold">Editar Jogo</SheetTitle>
        </SheetHeader>

        {isLoadingGame ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="text-primary size-8" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}
              className="space-y-4 px-5 pb-5"
            >
              <GameFormFields
                control={form.control}
                setValue={form.setValue}
                onImageChange={handleImageChange}
                imagePreview={imagePreview}
                currentImageUrl={currentImageUrl}
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
