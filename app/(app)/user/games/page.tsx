'use client'

import { useMemo, useState } from 'react'
import { UserGameFilters } from '../../../../components/personalized/votePage/user-game-filters'
import { UserGameGrid } from '../../../../components/personalized/votePage/user-game-grid'
import { GamesSkeleton } from '../../../../components/personalized/votePage/games-skeleton'
import type { GameWithVotesAndCategoryDTO } from '@/lib/Dto/gameDTO'
import { useQuery } from '@tanstack/react-query'

export default function GamesPage() {
  const [search, setSearch] = useState('')
  const [pendingOnly, setPendingOnly] = useState(false)

  const { data: games, isLoading } = useQuery<GameWithVotesAndCategoryDTO[]>({
    queryKey: ['gamesToUser'],
    queryFn: async () => {
      const response = await fetch('/api/WithVoteByuser')
      if (!response.ok) throw new Error('Erro ao buscar jogos')
      return response.json()
    },
  })

  const filteredGames = useMemo(() => {
    if (!games) return []

    return games.filter((game) => {
      const matchesSearch = search ? game.name.toLowerCase().includes(search.toLowerCase()) : true

      if (pendingOnly) {
        const votedCount = game.categories.map((e) => e.vote).filter((e) => e != null).length
        const totalCategories = game.categories?.length || 0

        const hasPending = votedCount < totalCategories && totalCategories > 0
        return matchesSearch && hasPending
      }
      return matchesSearch
    })
  }, [games, search, pendingOnly])

  if (isLoading) {
    return <GamesSkeleton />
  }

  return (
    <div className="container mx-auto space-y-4 px-4 py-6 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Jogos</h1>
        <p className="text-muted-foreground text-sm">
          Vote nos seus jogos favoritos em cada categoria
        </p>
      </div>

      <UserGameFilters
        search={search}
        onSearchChange={setSearch}
        pendingOnly={pendingOnly}
        onPendingOnlyChange={setPendingOnly}
      />

      <UserGameGrid games={filteredGames} />
    </div>
  )
}
