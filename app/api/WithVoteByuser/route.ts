import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO";
import { GameWithVotesAndCategoryDTO } from "@/lib/Dto/gameDTO";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Vote } from "@/prisma/generated/client";

export async function GET(
  request: NextRequest
): Promise<NextResponse<GameWithVotesAndCategoryDTO[] | { error: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "USER")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // const userId = request.nextUrl.searchParams.get("userId");
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: "Parâmetro userId é obrigatório" },
    //     { status: 400 }
    //   );

    // }

    console.log(session.user);

    const games = await prisma.game.findMany({
      include: {
        categories: {
          include: {
            votes: {
              where: {
                userId: session.user.id,
                // Esta é a forma correta: usar a relação
                // O Prisma vai usar o gameId automaticamente quando você referencia
                // o relacionamento game->vote
              },
            },
          },
        },
        // Inclua os votos do jogo primeiro
        votes: {
          where: {
            userId: session.user.id,
          },
          include: {
            category: true,
          },
        },
      },
    });
    const gamesDto = games.map((game) => {
      // Usar Map em vez de objeto para evitar problemas de tipagem
      const voteMap = new Map<string, Vote>();

      game.votes.forEach((vote) => {
        voteMap.set(vote.categoryId, vote);
      });

      return {
        id: game.id,
        name: game.name,
        description: game.description,
        image_url: game.image_url,
        published: game.published,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        categories: game.categories.map((category) => {
          const vote = voteMap.get(category.id);

          return {
            id: category.id,
            name: category.name,
            description: category.description,
            vote: vote
              ? {
                  id: vote.id,
                  score: vote.score,
                  createdAt: vote.createdAt,
                  updatedAt: vote.updatedAt,
                }
              : null,
          };
        }),
      };
    });

    return NextResponse.json(gamesDto);
  } catch (error) {
    console.error("[v0] Erro ao buscar games:", error);
    return NextResponse.json(
      { error: "Erro ao buscar games" },
      { status: 500 }
    );
  }
}
