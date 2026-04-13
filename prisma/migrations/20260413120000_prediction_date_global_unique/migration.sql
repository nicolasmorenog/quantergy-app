WITH ranked_predictions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "predictionDate"
      ORDER BY "updatedAt" DESC, id DESC
    ) AS row_number
  FROM "predictions"
)
DELETE FROM "predictions"
WHERE id IN (
  SELECT id
  FROM ranked_predictions
  WHERE row_number > 1
);

DROP INDEX IF EXISTS "predictions_clientId_predictionDate_key";
CREATE UNIQUE INDEX "predictions_predictionDate_key" ON "predictions"("predictionDate");
