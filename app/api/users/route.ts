import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/lib/validations/user'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { APIError } from 'better-auth/api'
import { getUserPermision } from '@/app/permission/utils/getUserPermission'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('list', 'User')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('[v0] Erro ao buscar usuários:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { can, cannot } = getUserPermision(session.user.id, session.user.role)
    if (cannot('create', 'User')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    //valida os dados de entrada
    const body = await request.json()
    const validated = createUserSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.issues },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 400 })
    }

    let newUser

    try {
      newUser = await auth.api.createUser({
        body: {
          email: validated.data.email,
          password: validated.data.password,
          name: validated.data.name,
          role: validated.data.role,
          data: {
            role: validated.data.role,
          },
        },
      })
    } catch (error) {
      if (error instanceof APIError) {
        console.log('-------')

        console.log(error.message, error.status)
        console.log('-------')
        throw error
        // return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    console.log('Usuário criado com sucesso')

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('[v0] Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
