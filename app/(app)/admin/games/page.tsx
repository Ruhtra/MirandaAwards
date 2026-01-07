"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "../users/_components/page-header"
import { GameFilters } from "./_components/game-filters"
import { GameGrid } from "./_components/game-grid"
import { CreateGameSheet } from "./_components/create-game-sheet"
import { EditGameSheet } from "./_components/edit-game-sheet"

export default function GamesPage() {
  const [createSheetOpen, setCreateSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [publishedFilter, setPublishedFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const handleEditGame = (gameId: string) => {
    setSelectedGameId(gameId)
    setEditSheetOpen(true)
  }

  const handleCloseEditSheet = (open: boolean) => {
    setEditSheetOpen(open)
    if (!open) {
      setSelectedGameId(null)
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <PageHeader
        title="Jogos"
        action={
          <Button onClick={() => setCreateSheetOpen(true)} className="w-full md:w-auto gap-2">
            <Plus className="size-4" />
            Novo Jogo
          </Button>
        }
      />

      <GameFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        publishedFilter={publishedFilter}
        onPublishedChange={setPublishedFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      <div className="flex-1 overflow-hidden">
        <GameGrid
          onEditGame={handleEditGame}
          searchQuery={searchQuery}
          publishedFilter={publishedFilter}
          categoryFilter={categoryFilter}
        />
      </div>

      <CreateGameSheet open={createSheetOpen} onOpenChange={setCreateSheetOpen} />

      {selectedGameId && (
        <EditGameSheet open={editSheetOpen} onOpenChange={handleCloseEditSheet} gameId={selectedGameId} />
      )}
    </div>
  )
}
