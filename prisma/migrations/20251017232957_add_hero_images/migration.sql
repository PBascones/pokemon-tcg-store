-- CreateTable
CREATE TABLE "HeroImage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "mobileImageUrl" TEXT NOT NULL,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroImage_order_idx" ON "HeroImage"("order");

-- CreateIndex
CREATE INDEX "HeroImage_isActive_idx" ON "HeroImage"("isActive");
