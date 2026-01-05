import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO"
import { updateGameSchema } from "@/lib/validations/game"

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<GameWithCategoriesDTO | { error: string }>> {
    try {

        const session = {
            user: {
                role: "ADMIN"
            }

        }

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params
        if (!id) {
            return NextResponse.json({ error: "ID do game é obrigatório" }, { status: 400 })
        }

        const game = await prisma.game.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image_url: true,
                description: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                categories: true
            },
        })

        if (!game) {
            return NextResponse.json({ error: "Game não encontrado" }, { status: 404 })
        }

        return NextResponse.json(game)
    } catch (error) {
        console.error("[v0] Erro ao buscar game:", error)
        return NextResponse.json({ error: "Erro ao buscar game" }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {

        const session = {
            user: {
                role: "ADMIN"
            }

        }


        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params
        if (!id) {
            return NextResponse.json({ error: "ID do game é obrigatório" }, { status: 400 })
        }

        const body = await request.json()
        const validated = updateGameSchema.safeParse(body)

        if (!validated.success) {
            return NextResponse.json({ error: "Dados inválidos", details: validated.error.issues }, { status: 400 })
        }

        const { name, published, description, categoryIds } = validated.data


        const game = await prisma.game.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...({ published }),
                ...(categoryIds && {
                    categories: {
                        set: categoryIds.map((catId) => ({ id: catId })),
                    },
                }),
            },

            select: {

                id: true,
                name: true,
                image_url: true,
                description: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                categories: true
            },

        })

        return NextResponse.json(game)
    } catch (error) {
        console.error("[v0] Erro ao atualizar game:", error)
        return NextResponse.json({ error: "Erro ao atualizar game" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {

        const session = {
            user: {
                role: "ADMIN"
            }

        }


        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params
        if (!id) {
            return NextResponse.json({ error: "ID do game é obrigatório" }, { status: 400 })
        }

        await prisma.game.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Erro ao deletar game:", error)
        return NextResponse.json({ error: "Erro ao deletar game" }, { status: 500 })
    }
}
