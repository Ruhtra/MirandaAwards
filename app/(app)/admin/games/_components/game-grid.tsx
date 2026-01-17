'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Trash2, MoreVertical, Gamepad2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { DeleteGameDialog } from './delete-game-dialog'
import { GameGridSkeleton } from './game-grid-skeleton'
import { useState, useMemo } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { GameWithCategoriesDTO } from '@/lib/Dto/gameDTO'

interface GameGridProps {
  onEditGame: (gameId: string) => void
  searchQuery: string
  publishedFilter: string
  categoryFilter: string
}

export function GameGrid({
  onEditGame,
  searchQuery,
  publishedFilter,
  categoryFilter,
}: GameGridProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<GameWithCategoriesDTO | null>(null)

  const { data: games, isLoading } = useQuery<GameWithCategoriesDTO[]>({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await fetch('/api/games')
      if (!response.ok) throw new Error('Erro ao buscar jogos')
      return response.json()
    },
  })

  const filteredGames = useMemo(() => {
    if (!games) return []

    return games.filter((game) => {
      const matchesSearch = searchQuery
        ? game.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesPublished =
        publishedFilter === 'all'
          ? true
          : publishedFilter === 'published'
            ? game.published
            : !game.published

      return matchesSearch && matchesPublished
    })
  }, [games, searchQuery, publishedFilter])

  const deleteMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erro ao deletar jogo')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      toast({
        title: 'Jogo deletado',
        description: 'O jogo foi removido com sucesso',
      })
      setDeleteDialogOpen(false)
      setGameToDelete(null)
    },
    onError: () => {
      toast({
        title: 'Erro ao deletar',
        description: 'Não foi possível deletar o jogo',
        variant: 'destructive',
      })
    },
  })

  const handleDeleteClick = (game: GameWithCategoriesDTO) => {
    setGameToDelete(game)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (gameToDelete) {
      deleteMutation.mutate(gameToDelete.id)
    }
  }

  if (isLoading) {
    return <GameGridSkeleton />
  }

  if (!filteredGames || filteredGames.length === 0) {
    return (
      <Card className="glass-card p-8">
        <Empty>
          <EmptyMedia>
            <Gamepad2 className="text-muted-foreground size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {searchQuery || publishedFilter !== 'all'
                ? 'Nenhum jogo encontrado'
                : 'Nenhum jogo cadastrado'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery || publishedFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro jogo'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card h-full overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="group border-border/50 hover:border-border relative overflow-hidden py-0 transition-all"
              >
                <div className="from-primary/10 to-accent/10 relative aspect-square bg-gradient-to-br">
                  {game.image_url ? (
                    <img
                      src={game.image_url || '/placeholder.svg'}
                      alt={game.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Gamepad2 className="text-muted-foreground/30 size-12" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={game.published ? 'default' : 'secondary'} className="gap-1">
                      {game.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {game.published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>

                  <div className="absolute top-2 left-2 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="bg-background/80 size-7 backdrop-blur-sm"
                        >
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onEditGame(game.id)}>
                          <Edit className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteClick(game)}
                        >
                          <Trash2 className="size-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-2.5">
                  <h3 className="text-foreground truncate text-sm font-semibold">{game.name}</h3>
                  {game.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {game.description}
                    </p>
                  )}
                  {game.categories && game.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {game.categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.id} variant="outline" className="px-1.5 py-0 text-[10px]">
                          {cat.name}
                        </Badge>
                      ))}
                      {game.categories.length > 2 && (
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                          +{game.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <DeleteGameDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        gameName={gameToDelete?.name || ''}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
