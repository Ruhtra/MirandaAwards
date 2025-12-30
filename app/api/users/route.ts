import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validations/user"
// import { auth } from "@/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    // const session = await auth.api.getSession({
    //   headers: await headers(),
    // })

    const session  = {
      user: {
        role: "ADMIN"
      }

    }

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
    console.error("[v0] Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
  
    const session  = {
      user: {
        role: "ADMIN"
      }

    }


    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validated = createUserSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validated.error.issues }, { status: 400 })
    }

    const { name, email, password, role } = validated.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
    }

    // const hashedPassword = await bcrypt.hash(password, 10)
    const hashedPassword = password

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("[v0] Erro ao criar usuário:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
