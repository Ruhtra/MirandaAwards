"use client";

import { useState } from "react";
import { UserGameFilters } from "./_components/user-game-filters";
import { UserGameGrid } from "./_components/user-game-grid";
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO";

// Mock data - substituir por dados reais da API
const mockGames = [
  {
    id: "1",
    name: "The Legend of Zelda: Tears of the Kingdom",
    imageUrl: "/placeholder.svg?height=400&width=300",
    categories: [
      {
        id: "1",
        name: "Jogabilidade",
        description: "Como o jogo é divertido e responsivo",
      },
      { id: "2", name: "História", description: "Narrativa e enredo do jogo" },
      {
        id: "3",
        name: "Gráficos",
        description: "Qualidade visual e design artístico",
      },
      {
        id: "4",
        name: "Áudio",
        description: "Trilha sonora e efeitos sonoros",
      },
    ],
  },
  {
    id: "2",
    name: "Baldur's Gate 3",
    imageUrl: "/placeholder.svg?height=400&width=300",
    categories: [
      {
        id: "1",
        name: "Jogabilidade",
        description: "Como o jogo é divertido e responsivo",
      },
      { id: "2", name: "História", description: "Narrativa e enredo do jogo" },
      {
        id: "3",
        name: "Gráficos",
        description: "Qualidade visual e design artístico",
      },
    ],
  },
  {
    id: "3",
    name: "Spider-Man 2",
    imageUrl: "/placeholder.svg?height=400&width=300",
    categories: [
      {
        id: "1",
        name: "Jogabilidade",
        description: "Como o jogo é divertido e responsivo",
      },
      { id: "2", name: "História", description: "Narrativa e enredo do jogo" },
    ],
  },
];

// Mock user votes
const mockUserVotes: any = {
  "2": { "1": 9, "2": 8, "3": 10 }, // Baldur's Gate 3 - completamente votado
  "3": { "1": 7 }, // Spider-Man 2 - parcialmente votado
  // Game 1 não tem votos - pendente
};

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);

  // Filter games based on search and pendingOnly
  const filteredGames: any = mockGames.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (pendingOnly) {
      const gameVotes = mockUserVotes[game.id] || {};
      const votedCount = Object.keys(gameVotes).length;
      const totalCategories = game.categories?.length || 0;
      const hasPending = votedCount < totalCategories && totalCategories > 0;
      return hasPending;
    }

    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Jogos</h1>
        <p className="text-sm text-muted-foreground">
          Vote nos seus jogos favoritos em cada categoria
        </p>
      </div>

      <UserGameFilters
        search={search}
        onSearchChange={setSearch}
        pendingOnly={pendingOnly}
        onPendingOnlyChange={setPendingOnly}
      />

      <UserGameGrid games={filteredGames} userVotes={mockUserVotes} />
    </div>
  );
}
