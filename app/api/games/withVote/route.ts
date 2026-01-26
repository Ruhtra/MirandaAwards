import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import type { GameWithVotesAndCategoryDTO } from '@/lib/Dto/gameDTO'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { Vote } from '@/prisma/generated/client'
import { getUserPermision } from '@/app/permission/utils/getUserPermission'

export async function GET(): Promise<
  NextResponse<GameWithVotesAndCategoryDTO[] | { error: string }>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('list', 'GameWithVote')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const games = await prisma.game.findMany({
      include: {
        categories: {
          include: {
            votes: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
        votes: {
          where: {
            userId: session.user.id,
          },
          include: {
            category: true,
          },
        },
      },
      where: {
        published: true,
      },
    })

    const gamesDto = games.map((game) => {
      const voteMap = new Map<string, Vote>()

      game.votes.forEach((vote) => {
        voteMap.set(vote.categoryId, vote)
      })

      return {
        id: game.id,
        name: game.name,
        description: game.description,
        image_url: game.image_url,
        published: game.published,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        categories: game.categories.map((category) => {
          const vote = voteMap.get(category.id)

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
          }
        }),
      }
    })

    return NextResponse.json(gamesDto)
  } catch (error) {
    console.error('[v0] Erro ao buscar games:', error)
    return NextResponse.json({ error: 'Erro ao buscar games' }, { status: 500 })
  }
}
