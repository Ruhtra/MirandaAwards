import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { CategoryWithGamesDTO } from '@/lib/Dto/categoryDTO'
import { auth } from '@/lib/auth'
import { getUserPermision } from '@/app/permission/utils/getUserPermission'
import { headers } from 'next/headers'

export async function GET(): Promise<NextResponse<CategoryWithGamesDTO[] | { error: string }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('list', 'CategoryWithGames')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        games: true,
      },
    })

    const categoriesDto: CategoryWithGamesDTO[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      _count: {
        games: category.games.length,
      },
      games: category.games.map((game) => ({
        id: game.id,
        name: game.name,
        image_url: game.image_url,
      })),
    }))

    return NextResponse.json(categoriesDto)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
