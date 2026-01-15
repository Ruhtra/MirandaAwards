import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GameWithCategoriesDTO } from "@/lib/Dto/gameDTO";
import { updateGameSchema } from "@/lib/validations/game";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { del } from "@vercel/blob";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<GameWithCategoriesDTO | { error: string }>> {
  try {
    const session = {
      user: {
        role: "ADMIN",
      },
    };

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID do game é obrigatório" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image_url: true,
        image_filename: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        categories: true,
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("[v0] Erro ao buscar game:", error);
    return NextResponse.json({ error: "Erro ao buscar game" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID do game é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updateGameSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const {
      name,
      published,
      description,
      categoryIds,
      imageUrl,
      imageFilename,
      imageRemoved,
      oldImageUrl,
    } = validated.data;

    // Case 1: Image was removed (imageRemoved = true)
    // Case 2: Image was changed (oldImageUrl exists and is different from new imageUrl)
    if (
      oldImageUrl &&
      (imageRemoved || (imageUrl && oldImageUrl !== imageUrl))
    ) {
      try {
        await del(oldImageUrl);
        console.log("[v0] Imagem antiga deletada:", oldImageUrl);
      } catch (deleteError) {
        console.error("[v0] Erro ao deletar imagem antiga:", deleteError);
        // Continue with update even if delete fails
      }
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...{ published },
        ...(imageRemoved
          ? { image_url: null, image_filename: null }
          : {
              ...(imageUrl !== undefined && { image_url: imageUrl }),
              ...(imageFilename !== undefined && {
                image_filename: imageFilename,
              }),
            }),
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
        image_filename: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        categories: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("[v0] Erro ao atualizar game:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar game" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID do game é obrigatório" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id },
      select: { image_url: true },
    });

    // Delete image from Vercel Blob if exists
    if (game?.image_url) {
      try {
        await del(game.image_url);
        console.log("[v0] Imagem do jogo deletada:", game.image_url);
      } catch (deleteError) {
        console.error("[v0] Erro ao deletar imagem do jogo:", deleteError);
        // Continue with deletion even if image delete fails
      }
    }

    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Erro ao deletar game:", error);
    return NextResponse.json(
      { error: "Erro ao deletar game" },
      { status: 500 }
    );
  }
}
