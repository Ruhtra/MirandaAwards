import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validations/user"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { APIError } from "better-auth/api"
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO"
import { Game } from "@/prisma/generated/client"

export async function GET(): Promise<NextResponse<GameWithCategoriesDTO[] | { error: string }>> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const games = await prisma.game.findMany({
            include: {
                categories: {}
            }
        })

        const gamesDto: GameWithCategoriesDTO[] = games.map((game) => ({
            id: game.id,
            name: game.name,
            description: game.description,
            image_url: game.image_url,
            published: game.published,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
            categories: game.categories.map((category) => ({
                id: category.id,
                name: category.name,
            })),
        }))


        return NextResponse.json(gamesDto)
    } catch (error) {
        console.error("[v0] Erro ao buscar games:", error)
        return NextResponse.json({ error: "Erro ao buscar games" }, { status: 500 })
    }
}

// export async function POST(request: Request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     })

//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
//     }


//     //valida os dados de entrada
//     const body = await request.json()
//     const validated = createUserSchema.safeParse(body)

//     if (!validated.success) {
//       return NextResponse.json({ error: "Dados inválidos", details: validated.error.issues }, { status: 400 })
//     }




//     const existingUser = await prisma.user.findUnique({
//       where: { email: validated.data.email },
//     })

//     if (existingUser) {
//       return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
//     }

//     let newUser

//     try {
//       newUser = await auth.api.createUser({
//         body: {
//           email: validated.data.email,
//           password: validated.data.password,
//           name: validated.data.name,
//           role: "user",
//           data: {
//             role: validated.data.role,
//           }
//         },
//       });
//     } catch (error) {
//       if (error instanceof APIError) {
//         console.log('-------');

//         console.log(error.message, error.status)
//         console.log('-------');
//         throw error
//         // return NextResponse.json({ error: error.message }, { status: 500 })
//       }
//     }


//     console.log("Usuário criado com sucesso")


//     return NextResponse.json(newUser, { status: 201 })
//   } catch (error) {
//     console.error("[v0] Erro ao criar usuário:", error)
//     return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
//   }
// }
