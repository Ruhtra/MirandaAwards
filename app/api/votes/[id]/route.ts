import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { voteUpdateSchema } from '@/lib/validations/vote'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserPermision } from '@/app/permission/utils/getUserPermission'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const voteFinded = await prisma.vote.findUnique({
      where: { id: params.id },
    })

    if (!voteFinded) return NextResponse.json({ error: 'Voto não encontrado' }, { status: 404 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('update', { kind: 'Vote', id: voteFinded.userId })) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = voteUpdateSchema.parse(body)

    const vote = await prisma.vote.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        category: true,
        game: true,
      },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('[v0] Error updating vote:', error)
    return NextResponse.json({ error: 'Erro ao atualizar voto' }, { status: 500 })
  }
}

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {

//     const session = await auth.api.getSession({ headers: await headers() })
//     if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

//     const { can, cannot } = getUserPermision(session.user.id, session.user.role)
//     if (cannot('delete', 'Vote')) {
//       return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
//     }

//     await prisma.vote.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ message: 'Voto excluído com sucesso' })
//   } catch (error) {
//     console.error('[v0] Error deleting vote:', error)
//     return NextResponse.json({ error: 'Erro ao excluir voto' }, { status: 500 })
//   }
// }
