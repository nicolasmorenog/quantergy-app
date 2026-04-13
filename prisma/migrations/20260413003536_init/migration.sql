-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "displayName" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'MWh',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "predictionDate" DATE NOT NULL,
    "predictedValue" DECIMAL(10,2) NOT NULL,
    "realValue" DECIMAL(10,2),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_externalId_key" ON "clients"("externalId");

-- CreateIndex
CREATE INDEX "predictions_predictionDate_idx" ON "predictions"("predictionDate");

-- CreateIndex
CREATE UNIQUE INDEX "predictions_clientId_predictionDate_key" ON "predictions"("clientId", "predictionDate");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
