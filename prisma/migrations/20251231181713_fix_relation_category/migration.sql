/*
  Warnings:

  - You are about to drop the column `gameId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_gameId_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "gameId";

-- CreateTable
CREATE TABLE "_CategoryToGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToGame_B_index" ON "_CategoryToGame"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToGame" ADD CONSTRAINT "_CategoryToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToGame" ADD CONSTRAINT "_CategoryToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
