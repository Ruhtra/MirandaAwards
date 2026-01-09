"use client";

import { useState } from "react";
import { Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { GameWithVotesAndCategoryDTO } from "@/lib/Dto/gameDTO";

interface GameVoteSheetProps {
  game: GameWithVotesAndCategoryDTO;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameVoteSheet({
  game,
  isOpen,
  onOpenChange,
}: GameVoteSheetProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleVoteChange = (categoryId: string, value: number) => {
    // setVotes((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save votes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Votos salvos!",
        description: "Seus votos foram salvos com sucesso.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar seus votos.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const categories = game.categories || [];
  const votedCount = game.categories.map((e) => e.vote).length;
  const progress =
    categories.length > 0 ? (votedCount / categories.length) * 100 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-lg sm:text-xl font-bold line-clamp-2">
            {game.name}
          </SheetTitle>
          <SheetDescription className="text-sm">
            Vote em cada categoria de 0 a 10
          </SheetDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            Progresso: {votedCount}/{categories.length} categorias
          </div>
        </SheetHeader>

        {/* Categories List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="space-y-5">
            {categories.map((category) => {
              const currentVote = category.vote?.score ?? 0;
              return (
                <div
                  key={category.id}
                  className="space-y-2 rounded-lg border border-border/50 bg-background/50 p-3 backdrop-blur-sm"
                >
                  {/* Category Name with Info Icon */}
                  <div className="flex items-start justify-between gap-2">
                    <Label
                      htmlFor={`vote-${category.id}`}
                      className="text-sm font-medium leading-tight flex-1"
                    >
                      {category.name}
                    </Label>

                    {/* {category.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="max-w-xs text-xs"
                          >
                            {category.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} */}
                  </div>

                  {/* Vote Value Display */}
                  <div className="flex items-center justify-center">
                    <div className="text-2xl font-bold tabular-nums">
                      {currentVote}
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>

                  {/* Slider */}
                  <Slider
                    id={`vote-${category.id}`}
                    min={0}
                    max={10}
                    step={1}
                    value={[currentVote]}
                    onValueChange={([value]) =>
                      handleVoteChange(category.id, value)
                    }
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="border-t px-4 sm:px-6 py-4 bg-background">
          <Button
            onClick={handleSave}
            disabled={isSaving || categories.length === 0}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Votos"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
