-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('en', 'ko', 'no');

-- CreateEnum
CREATE TYPE "public"."RsvpStatus" AS ENUM ('yes', 'no', 'maybe');

-- CreateTable
CREATE TABLE "public"."Invite" (
    "id" TEXT NOT NULL,
    "guestName" TEXT,
    "language" "public"."Language" DEFAULT 'en',
    "rsvpStatus" "public"."RsvpStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rsvp" (
    "id" TEXT NOT NULL,
    "inviteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."RsvpStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rsvp_inviteId_idx" ON "public"."Rsvp"("inviteId");

-- AddForeignKey
ALTER TABLE "public"."Rsvp" ADD CONSTRAINT "Rsvp_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "public"."Invite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
