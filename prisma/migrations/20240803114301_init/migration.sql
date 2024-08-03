-- CreateTable
CREATE TABLE "UserDbs" (
    "id" SERIAL NOT NULL,
    "database" TEXT NOT NULL,
    "dbname" TEXT NOT NULL,
    "dburl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDbs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserDbs" ADD CONSTRAINT "UserDbs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
