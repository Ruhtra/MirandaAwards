"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash2, MoreVertical, Gamepad2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DeleteGameDialog } from "./delete-game-dialog"
import { GameGridSkeleton } from "./game-grid-skeleton"
import { useState, useMemo } from "react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO"

interface GameGridProps {
  onEditGame: (gameId: string) => void
  searchQuery: string
  publishedFilter: string
  categoryFilter: string
}

export function GameGrid({ onEditGame, searchQuery, publishedFilter, categoryFilter }: GameGridProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<GameWithCategoriesDTO | null>(null)

  const { data: games, isLoading } = useQuery<GameWithCategoriesDTO[]>({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("/api/games")
      if (!response.ok) throw new Error("Erro ao buscar jogos")
      return response.json()
    },
  })

  const filteredGames = useMemo(() => {
    if (!games) return []

    return games.filter((game) => {
      const matchesSearch = searchQuery ? game.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

      const matchesPublished =
        publishedFilter === "all" ? true : publishedFilter === "published" ? game.published : !game.published

      return matchesSearch && matchesPublished
    })
  }, [games, searchQuery, publishedFilter])

  const deleteMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erro ao deletar jogo")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      toast({
        title: "Jogo deletado",
        description: "O jogo foi removido com sucesso",
      })
      setDeleteDialogOpen(false)
      setGameToDelete(null)
    },
    onError: () => {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o jogo",
        variant: "destructive",
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
            <Gamepad2 className="size-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {searchQuery || publishedFilter !== "all" ? "Nenhum jogo encontrado" : "Nenhum jogo cadastrado"}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery || publishedFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Comece criando seu primeiro jogo"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card overflow-hidden h-full p-0">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="group relative overflow-hidden border-border/50 hover:border-border transition-all py-0"
              >
                <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-accent/10">
                  {game.image_url ? (
                    <img
                      src={game.image_url || "/placeholder.svg"}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="size-12 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={game.published ? "default" : "secondary"} className="gap-1">
                      {game.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {game.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon-sm" className="size-7 bg-background/80 backdrop-blur-sm">
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onEditGame(game.id)}>
                          <Edit className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(game)}>
                          <Trash2 className="size-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-2.5">
                  <h3 className="font-semibold text-sm text-foreground truncate">{game.name}</h3>
                  {game.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{game.description}</p>
                  )}
                  {game.categories && game.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game.categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.id} variant="outline" className="text-[10px] px-1.5 py-0">
                          {cat.name}
                        </Badge>
                      ))}
                      {game.categories.length > 2 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
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
        gameName={gameToDelete?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
