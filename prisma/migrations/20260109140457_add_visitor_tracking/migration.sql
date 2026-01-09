-- CreateTable
CREATE TABLE "public"."Visitor" (
    "id" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "countryRegion" TEXT,
    "region" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "language" TEXT,
    "page" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visitor_country_idx" ON "public"."Visitor"("country");

-- CreateIndex
CREATE INDEX "Visitor_createdAt_idx" ON "public"."Visitor"("createdAt");
