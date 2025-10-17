-- AlterTable
ALTER TABLE "public"."Rsvp" ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "plusOne" BOOLEAN NOT NULL DEFAULT false;
