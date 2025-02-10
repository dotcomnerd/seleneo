-- CreateTable
CREATE TABLE "ImageHash" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "perceptualHash" TEXT NOT NULL,

    CONSTRAINT "ImageHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageHash_imageId_key" ON "ImageHash"("imageId");

-- AddForeignKey
ALTER TABLE "ImageHash" ADD CONSTRAINT "ImageHash_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "UserImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
