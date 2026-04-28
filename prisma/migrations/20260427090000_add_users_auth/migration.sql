CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

CREATE TABLE "users" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "clientId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

ALTER TABLE "users"
  ADD CONSTRAINT "users_clientId_fkey"
  FOREIGN KEY ("clientId")
  REFERENCES "clients"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
