"use client"

import { useState } from "react"
import { Info, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import type { GameWithVotesAndCategoryDTO } from "@/lib/Dto/gameDTO"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

interface GameVoteSheetProps {
  game: GameWithVotesAndCategoryDTO
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface CategoryVoteState {
  score: number
  voted: boolean
}

export function GameVoteSheet({ game, isOpen, onOpenChange }: GameVoteSheetProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [votes, setVotes] = useState<Record<string, CategoryVoteState>>(() => {
    const initialVotes: Record<string, CategoryVoteState> = {}
    game.categories.forEach((category) => {
      initialVotes[category.id] = {
        score: category.vote?.score ?? 5, // Default to 5 if no vote
        voted: category.vote !== undefined && category.vote !== null, // true if vote exists
      }
    })
    return initialVotes
  })

  const saveVotesMutation = useMutation({
    mutationFn: async (votesToSave: Array<{ categoryId: string; score: number; voted: boolean }>) => {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
          votes: votesToSave,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar votos")
      }

      return response.json()
    },
    onMutate: async (votesToSave) => {
      await queryClient.cancelQueries({ queryKey: ["gamesToUser"] })
      const previousGames = queryClient.getQueryData(["gamesToUser"])

      queryClient.setQueryData<GameWithVotesAndCategoryDTO[]>(["gamesToUser"], (old) => {
        if (!old) return old
        return old.map((g) => {
          if (g.id === game.id) {
            return {
              ...g,
              categories: g.categories.map((cat) => {
                const voteUpdate = votesToSave.find((v) => v.categoryId === cat.id)
                if (voteUpdate) {
                  return {
                    ...cat,
                    vote: voteUpdate.voted
                      ? {
                        id: cat.vote?.id || "temp-id",
                        score: voteUpdate.score,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }
                      : undefined, // Remove vote if not voted
                  }
                }
                return cat
              }),
            }
          }
          return g
        })
      })

      return { previousGames }
    },
    onError: (err, votesToSave, context) => {
      queryClient.setQueryData(["gamesToUser"], context?.previousGames)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar seus votos.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        title: "Votos salvos!",
        description: "Seus votos foram salvos com sucesso.",
      })
      onOpenChange(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gamesToUser"] })
    },
  })

  const handleVotedToggle = (categoryId: string, voted: boolean) => {
    setVotes((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        voted,
      },
    }))
  }

  const handleScoreChange = (categoryId: string, score: number) => {
    setVotes((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        score,
      },
    }))
  }

  const handleSave = async () => {
    const votesToSave = game.categories.map((category) => ({
      categoryId: category.id,
      score: votes[category.id].score,
      voted: votes[category.id].voted,
    }))

    saveVotesMutation.mutate(votesToSave)
  }

  const categories = game.categories || []
  const votedCount = categories.filter((cat) => votes[cat.id]?.voted).length

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <SheetTitle className="text-lg font-bold line-clamp-2">{game.name}</SheetTitle>
              <SheetDescription className="text-xs">Vote de 0 a 10 ou marque como não votado</SheetDescription>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium tabular-nums">
                {votedCount}/{categories.length}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${categories.length > 0 ? (votedCount / categories.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Categories List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="space-y-3">
            {categories.map((category) => {
              const voteState = votes[category.id]
              const isVoted = voteState?.voted ?? false
              const score = voteState?.score ?? 5

              return (
                <div
                  key={category.id}
                  className={cn(
                    "space-y-3 rounded-lg border p-3 transition-all duration-200",
                    isVoted ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/50 bg-muted/30 opacity-75",
                  )}
                >
                  {/* Category Header with Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`voted-${category.id}`} className="text-sm font-semibold leading-tight">
                          {category.name}
                        </Label>
                        {category.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs text-xs">
                                {category.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{isVoted ? "Votado" : "Não votado"}</p>
                    </div>

                    <Switch
                      id={`voted-${category.id}`}
                      checked={isVoted}
                      onCheckedChange={(checked) => handleVotedToggle(category.id, checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  {/* Vote Score Section */}
                  <div className={cn("space-y-2 transition-opacity", !isVoted && "opacity-40 pointer-events-none")}>
                    {/* Score Display */}
                    <div className="flex items-center justify-center py-1">
                      <div className="text-3xl font-bold tabular-nums tracking-tight">
                        {score}
                        <span className="text-sm text-muted-foreground font-normal">/10</span>
                      </div>
                    </div>

                    {/* Slider */}
                    <Slider
                      id={`score-${category.id}`}
                      min={0}
                      max={10}
                      step={1}
                      value={[score]}
                      onValueChange={([value]) => handleScoreChange(category.id, value)}
                      disabled={!isVoted}
                      className="w-full"
                    />

                    {/* Score Labels */}
                    <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="border-t px-4 sm:px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            onClick={handleSave}
            disabled={saveVotesMutation.isPending || categories.length === 0}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {saveVotesMutation.isPending ? "Salvando..." : "Salvar Votos"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
