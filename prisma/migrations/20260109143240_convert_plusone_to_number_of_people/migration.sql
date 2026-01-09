/*
  Warnings:

  - You are about to drop the column `plusOne` on the `Rsvp` table. All the data in the column will be lost.

*/
-- Step 1: Add the new numberOfPeople column with default value 1
ALTER TABLE "public"."Rsvp" ADD COLUMN "numberOfPeople" INTEGER NOT NULL DEFAULT 1;

-- Step 2: Convert existing plusOne data to numberOfPeople (false → 1, true → 2)
UPDATE "public"."Rsvp" SET "numberOfPeople" = CASE
  WHEN "plusOne" = false THEN 1
  WHEN "plusOne" = true THEN 2
  ELSE 1
END;

-- Step 3: Drop the old plusOne column
ALTER TABLE "public"."Rsvp" DROP COLUMN "plusOne";
