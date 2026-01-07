"use client";

import { useState } from "react";
import { UserGameCard } from "./user-game-card";
import { GameVoteSheet } from "./game-vote-sheet";
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO";

interface UserGameGridProps {
  games: GameWithCategoriesDTO[];
  userVotes: Record<string, Record<string, number>>; // gameId -> categoryId -> score
}

export function UserGameGrid({ games, userVotes }: UserGameGridProps) {
  const [selectedGame, setSelectedGame] =
    useState<GameWithCategoriesDTO | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleGameClick = (game: GameWithCategoriesDTO) => {
    setSelectedGame(game);
    setIsSheetOpen(true);
  };

  const getGameVoteStats = (game: GameWithCategoriesDTO) => {
    const gameVotes = userVotes[game.id] || {};
    const votedCount = Object.keys(gameVotes).length;
    const totalCategories = game.categories?.length || 0;
    const hasPendingVotes = votedCount < totalCategories && totalCategories > 0;

    return { votedCount, totalCategories, hasPendingVotes };
  };

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Nenhum jogo encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
        {games.map((game) => {
          const stats = getGameVoteStats(game);
          return (
            <UserGameCard
              key={game.id}
              game={game}
              {...stats}
              onClick={() => handleGameClick(game)}
            />
          );
        })}
      </div>

      {selectedGame && (
        <GameVoteSheet
          game={selectedGame}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          userVotes={userVotes[selectedGame.id] || {}}
        />
      )}
    </>
  );
}
