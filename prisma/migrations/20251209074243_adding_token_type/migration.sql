/*
  Warnings:

  - Added the required column `type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD', 'EMAIL_VERIFICATION');

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "type" "TokenType" NOT NULL;
