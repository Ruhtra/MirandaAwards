'use client'

import type React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (file: File | null, previewUrl: string | null) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, disabled = false, className }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Display: local preview (new file) or existing value (from database)
  const displayUrl = localPreview || value

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [localPreview])

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null)

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB')
        return
      }

      // Revoke old preview URL
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }

      // Create local preview
      const previewUrl = URL.createObjectURL(file)
      setLocalPreview(previewUrl)

      // Pass file and preview to parent
      onChange(file, previewUrl)
    },
    [onChange, localPreview],
  )

  const handleRemove = useCallback(() => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview)
      setLocalPreview(null)
    }
    onChange(null, null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [onChange, localPreview])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [disabled, handleFileSelect],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Preview / Upload Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-200',
          'border-2 border-dashed',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/30',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {displayUrl ? (
          // Image Preview
          <div className="relative aspect-video w-full">
            <img
              src={displayUrl || '/placeholder.svg'}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="gap-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                <Upload className="size-4" />
                Trocar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                <X className="size-4" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          // Empty State / Drop Zone
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 p-6">
            <div
              className={cn(
                'flex size-14 items-center justify-center rounded-xl transition-colors',
                dragActive ? 'bg-primary/20' : 'bg-muted',
              )}
            >
              <ImageIcon
                className={cn(
                  'size-7 transition-colors',
                  dragActive ? 'text-primary' : 'text-muted-foreground',
                )}
              />
            </div>
            <div className="text-center">
              <p className="text-foreground text-sm font-medium">
                {dragActive ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">JPG, PNG, WebP ou GIF (máx. 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-destructive flex items-center gap-2 px-1 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
