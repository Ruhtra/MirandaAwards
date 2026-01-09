"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO";

interface UserGameCardProps {
  game: GameWithCategoriesDTO;
  votedCount: number;
  totalCategories: number;
  hasPendingVotes: boolean;
  onClick: () => void;
}

export function UserGameCard({
  game,
  votedCount,
  totalCategories,
  hasPendingVotes,
  onClick,
}: UserGameCardProps) {
  const progress =
    totalCategories > 0 ? (votedCount / totalCategories) * 100 : 0;
  const isComplete = votedCount === totalCategories && totalCategories > 0;

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 py-0 ${
        hasPendingVotes
          ? "border-red-500/50 ring-2 ring-red-500/20"
          : isComplete
          ? "border-green-500/50"
          : ""
      }`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={
            /*game.imageUrl*/ false || "/placeholder.svg?height=400&width=300"
          }
          alt={game.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Pending Badge */}
        {hasPendingVotes && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 text-xs font-semibold shadow-lg animate-pulse"
          >
            Pendente
          </Badge>
        )}

        {/* Complete Badge */}
        {isComplete && !hasPendingVotes && (
          <Badge
            variant="default"
            className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-xs font-semibold shadow-lg"
          >
            Completo
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {game.name}
        </h3>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">
              {votedCount}/{totalCategories}
            </span>
          </div>
          <Progress
            value={progress}
            className={`h-1.5 ${
              hasPendingVotes
                ? "[&>div]:bg-red-500"
                : isComplete
                ? "[&>div]:bg-green-500"
                : ""
            }`}
          />
        </div>

        {/* Categories */}
        {game.categories && game.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.categories.slice(0, 2).map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="text-xs px-2 py-0 h-5"
              >
                {category.name}
              </Badge>
            ))}
            {game.categories.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                +{game.categories.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
