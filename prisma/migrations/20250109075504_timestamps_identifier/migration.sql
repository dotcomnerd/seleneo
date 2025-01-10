/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `UserImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "identifier" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_identifier_key" ON "UserImage"("identifier");
