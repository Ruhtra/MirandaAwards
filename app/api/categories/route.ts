import { prisma } from "@/lib/prisma";
import type { CategoryDTO } from "@/lib/Dto/gameDTO";
import { NextResponse } from "next/server";
import { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCategorySchema } from "@/lib/validations/category";
import { randomUUID } from "crypto";

export async function GET(): Promise<
  NextResponse<CategoryDTO[] | { error: string }>
> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const categoriesDto: CategoryDTO[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));

    return NextResponse.json(categoriesDto);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<CategoryDTO | { error: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    //valida os dados de entrada
    const body = await request.json();
    const validated = createCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name: validated.data.name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Esta category já está em uso" },
        { status: 400 }
      );
    }

    const newCategory: CategoryDTO = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: validated.data.name,
        description: validated.data.description,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("[v0] Erro ao criar game:", error);
    return NextResponse.json({ error: "Erro ao criar game" }, { status: 500 });
  }
}
