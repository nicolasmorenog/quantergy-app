DROP INDEX IF EXISTS "predictions_predictionDate_key";
CREATE UNIQUE INDEX "predictions_clientId_predictionDate_key" ON "predictions"("clientId", "predictionDate");
