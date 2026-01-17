import { CategoryDTO } from '@/lib/Dto/gameDTO'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<CategoryDTO | { error: string }>> {
  try {
    const session = {
      user: {
        role: 'ADMIN',
      },
    }

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID da category é obrigatória' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            games: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category não encontrado' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('[v0] Erro ao buscar category:', error)
    return NextResponse.json({ error: 'Erro ao buscar category' }, { status: 500 })
  }
}
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = {
      user: {
        role: 'ADMIN',
      },
    }

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'ID da category é obrigatório' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome da category é obrigatório' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('[v0] Erro ao atualizar category:', error)
    return NextResponse.json({ error: 'Erro ao atualizar category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = {
      user: {
        role: 'ADMIN',
      },
    }

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID da category é obrigatório' }, { status: 400 })
    }

    const categoryWithGames = await prisma.category.findFirst({
      where: { id },
      select: {
        _count: {
          select: {
            games: true,
          },
        },
        id: true,
      },
    })

    if (!categoryWithGames)
      return NextResponse.json({ error: 'Category não encontrada' }, { status: 404 })

    if (categoryWithGames._count.games > 0)
      return NextResponse.json(
        { error: 'Esta category já possui games associados' },
        { status: 400 },
      )

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Erro ao deletar category:', error)
    return NextResponse.json({ error: 'Erro ao deletar category' }, { status: 500 })
  }
}
