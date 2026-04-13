import type { Prisma } from "@prisma/client";

import type { PredictionDto } from "@/lib/predictions";

type PredictionWithClient = Prisma.PredictionGetPayload<{
  include: {
    client: true;
  };
}>;

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

export function serializePrediction(
  prediction: PredictionWithClient,
): PredictionDto {
  const predictedValue = Number(prediction.predictedValue);
  const realValue =
    prediction.realValue === null ? null : Number(prediction.realValue);
  const difference =
    realValue === null ? null : roundToTwoDecimals(predictedValue - realValue);
  const errorPercent =
    difference === null || realValue === null || realValue === 0
      ? null
      : roundToTwoDecimals((Math.abs(difference) / realValue) * 100);

  return {
    id: prediction.id,
    client: {
      id: prediction.client.id,
      externalId: prediction.client.externalId,
      displayName: prediction.client.displayName,
      unit: prediction.client.unit,
    },
    predictionDate: prediction.predictionDate.toISOString().split("T")[0],
    predictedValue,
    realValue,
    difference,
    errorPercent,
    source: prediction.source,
    createdAt: prediction.createdAt.toISOString(),
    updatedAt: prediction.updatedAt.toISOString(),
  };
}

export function serializePredictions(predictions: PredictionWithClient[]) {
  return predictions.map(serializePrediction);
}
