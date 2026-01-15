import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { bulkVoteSchema } from "@/lib/validations/vote"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "USER")) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const gameId = searchParams.get("gameId")

        if (gameId) {
            const votes = await prisma.vote.findMany({
                where: {
                    userId: session.user.id,
                    gameId,
                },
                include: {
                    category: true,
                },
            })

            return NextResponse.json(votes)
        }

        const votes = await prisma.vote.findMany({
            where: { userId: session.user.id },
            include: {
                category: true,
                game: true,
            },
        })

        return NextResponse.json(votes)
    } catch (error) {
        console.error("[v0] Error fetching votes:", error)
        return NextResponse.json({ error: "Erro ao buscar votos" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "USER")) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()

        const validatedData = bulkVoteSchema.parse(body)

        if (validatedData.votes.length === 0) {
            return NextResponse.json({ error: "Nenhum voto fornecido" }, { status: 400 })
        }

        const votesToSave = validatedData.votes.filter((vote) => vote.voted)
        const votesToDelete = validatedData.votes.filter((vote) => !vote.voted)

        // Create or update votes for categories marked as voted
        const savePromises = votesToSave.map((vote) =>
            prisma.vote.upsert({
                where: {
                    userId_gameId_categoryId: {
                        userId: session.user.id,
                        gameId: validatedData.gameId,
                        categoryId: vote.categoryId,
                    },
                },
                update: {
                    score: vote.score,
                },
                create: {
                    id: `vote-${Date.now()}-${Math.random()}`,
                    userId: session.user.id,
                    gameId: validatedData.gameId,
                    categoryId: vote.categoryId,
                    score: vote.score,
                },
            }),
        )

        // Delete votes for categories marked as not voted
        const deletePromises = votesToDelete.map((vote) =>
            prisma.vote.deleteMany({
                where: {
                    userId: session.user.id,
                    gameId: validatedData.gameId,
                    categoryId: vote.categoryId,
                },
            }),
        )

        await Promise.all([...savePromises, ...deletePromises])

        // Return updated votes
        const votes = await prisma.vote.findMany({
            where: { userId: session.user.id, gameId: validatedData.gameId },
            include: { category: true },
        })

        return NextResponse.json(votes, { status: 201 })
    } catch (error) {
        console.error("[v0] Error creating votes:", error)
        return NextResponse.json({ error: "Erro ao criar votos" }, { status: 500 })
    }
}
