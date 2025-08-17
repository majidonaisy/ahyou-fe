/*
  Warnings:

  - You are about to drop the column `speaker` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "speaker",
ADD COLUMN     "speakers" JSONB;
