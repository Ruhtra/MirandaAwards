import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateUserSchema } from '@/lib/validations/user'
// import bcrypt from "bcrypt"
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[v0] Erro ao buscar usuário:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
    }

    const body = await request.json()
    const validated = updateUserSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.issues },
        { status: 400 },
      )
    }

    const { name, email, password, role } = validated.data

    // const { password: oldpassword } = await prisma.account.findFirstOrThrow({
    //   where: { userId: id, providerId: "credential" },
    //   select: {
    //     password: true
    //   },
    // })

    // const user = await prisma.user.update({
    //   where: { id },
    //   data: {

    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     role: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // })

    var user = await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          name: name,
          password: password,
          email: email,
        },
      },
      headers: await headers(),
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('[v0] Erro ao atualizar usuário:', error)
    console.error('[v0] Erro ao atualizar usuário:', error.body)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Erro ao deletar usuário:', error)
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 })
  }
}
