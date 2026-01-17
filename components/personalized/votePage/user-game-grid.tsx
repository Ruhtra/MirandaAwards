'use client'

import { useState } from 'react'
import { UserGameCard } from './user-game-card'
import { GameVoteSheet } from './game-vote-sheet'
import type { GameWithVotesAndCategoryDTO } from '@/lib/Dto/gameDTO'

interface UserGameGridProps {
  games: GameWithVotesAndCategoryDTO[]
}

export function UserGameGrid({ games }: UserGameGridProps) {
  const [selectedGame, setSelectedGame] = useState<GameWithVotesAndCategoryDTO | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleGameClick = (game: GameWithVotesAndCategoryDTO) => {
    setSelectedGame(game)
    setIsSheetOpen(true)
  }

  const getGameVoteStats = (game: GameWithVotesAndCategoryDTO) => {
    const votedCount = game.categories.map((e) => e.vote).filter((e) => e != null).length
    const totalCategories = game.categories?.length || 0
    const hasPendingVotes = votedCount < totalCategories && totalCategories > 0

    return { votedCount, totalCategories, hasPendingVotes }
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Nenhum jogo encontrado</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {games.map((game) => {
          const stats = getGameVoteStats(game)
          return (
            <UserGameCard
              key={game.id}
              game={game}
              {...stats}
              onClick={() => handleGameClick(game)}
            />
          )
        })}
      </div>

      {selectedGame && (
        <GameVoteSheet
          key={selectedGame.id}
          game={selectedGame}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </>
  )
}
