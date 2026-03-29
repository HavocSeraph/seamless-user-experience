/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '7 days';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" VARCHAR(255) NOT NULL;
