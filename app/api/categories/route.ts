
import { prisma } from "@/lib/prisma"
import type { CategoryDTO } from "@/lib/Dto/gameDTO"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse<CategoryDTO[] | { error: string }>> {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        })

        const categoriesDto: CategoryDTO[] = categories.map((category) => ({
            id: category.id,
            name: category.name,
        }))

        return NextResponse.json(categoriesDto)
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}
