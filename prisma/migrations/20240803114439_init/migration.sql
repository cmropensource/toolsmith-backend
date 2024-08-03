/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDbs" DROP CONSTRAINT "UserDbs_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_email_key" ON "UserData"("email");

-- AddForeignKey
ALTER TABLE "UserDbs" ADD CONSTRAINT "UserDbs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
