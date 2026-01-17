'use client'

import { AlertCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  userName: string
  isDeleting: boolean
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isDeleting,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-lg">
              <AlertCircle className="text-destructive size-5" />
            </div>
            <AlertDialogTitle className="text-xl">Confirmar Exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-base">
            Tem certeza que deseja excluir o usuário{' '}
            <span className="text-foreground font-semibold">{userName}</span>? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2 size-4" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
