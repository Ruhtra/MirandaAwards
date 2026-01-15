import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { voteUpdateSchema } from "@/lib/validations/vote"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
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
        console.error("[v0] Error updating vote:", error)
        return NextResponse.json({ error: "Erro ao atualizar voto" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.vote.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Voto excluído com sucesso" })
    } catch (error) {
        console.error("[v0] Error deleting vote:", error)
        return NextResponse.json({ error: "Erro ao excluir voto" }, { status: 500 })
    }
}
