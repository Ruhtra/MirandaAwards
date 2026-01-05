import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validations/user"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { APIError } from "better-auth/api"
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO"
import { Game } from "@/prisma/generated/client"
import { createGameSchema } from "@/lib/validations/game"
import { randomUUID } from "crypto"

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

export async function POST(request: Request): Promise<NextResponse<Game | { error: string }>> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }


        //valida os dados de entrada
        const body = await request.json()
        const validated = createGameSchema.safeParse(body)

        if (!validated.success) {
            return NextResponse.json({ error: "Dados inválidos", details: validated.error.issues }, { status: 400 })
        }





        const newGame = await prisma.game.create({
            data: {
                id: randomUUID(),
                name: validated.data.name,
                description: validated.data.description,
                published: validated.data.published,
                categories: {
                    connect: validated.data.categoryIds.map((catId) => ({ id: catId })),
                },
            },
            select: {
                id: true,
                name: true,
                image_url: true,
                description: true,
                published: true,
                createdAt: true,
                categories: true,
                updatedAt: true
            }
        })



        return NextResponse.json(newGame, { status: 201 })
    } catch (error) {
        console.error("[v0] Erro ao criar game:", error)
        return NextResponse.json({ error: "Erro ao criar game" }, { status: 500 })
    }
}
