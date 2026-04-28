import { prisma } from "@/server/db/client";
import { getCurrentUser } from "@/server/auth/session";
import { serializePredictions } from "@/server/predictions/serializers";
import type { PredictionsUploadPayload } from "@/lib/predictions/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidPredictionDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateUploadPayload(
  payload: unknown,
): payload is PredictionsUploadPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Partial<PredictionsUploadPayload>;

  if (
    typeof candidate.clientExternalId !== "string" ||
    candidate.clientExternalId.trim() === "" ||
    (candidate.unit !== undefined &&
      (typeof candidate.unit !== "string" || candidate.unit.trim() === "")) ||
    !Array.isArray(candidate.predictions) ||
    candidate.predictions.length === 0
  ) {
    return false;
  }

  const seenDates = new Set<string>();

  for (const prediction of candidate.predictions) {
    if (
      typeof prediction !== "object" ||
      prediction === null ||
      !isValidPredictionDate(prediction.predictionDate) ||
      !isFiniteNumber(prediction.predictedValue) ||
      !(prediction.realValue === null || isFiniteNumber(prediction.realValue)) ||
      seenDates.has(prediction.predictionDate)
    ) {
      return false;
    }

    seenDates.add(prediction.predictionDate);
  }

  return true;
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "You must sign in first." }, { status: 401 });
  }

  const predictions = await prisma.prediction.findMany({
    include: {
      client: true,
    },
    orderBy: {
      predictionDate: "desc",
    },
  });

  return Response.json({
    predictions: serializePredictions(predictions),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "You must sign in first." }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json(
      { error: "Only admins can upload predictions." },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);

  if (!validateUploadPayload(payload)) {
    return Response.json(
      { error: "Invalid predictions payload." },
      { status: 400 },
    );
  }

  const uploadedPredictions = await prisma.$transaction(async (tx) => {
    const client = await tx.client.upsert({
      where: {
        externalId: payload.clientExternalId,
      },
      update: payload.unit
        ? {
            unit: payload.unit,
          }
        : {},
      create: {
        externalId: payload.clientExternalId,
        ...(payload.unit ? { unit: payload.unit } : {}),
      },
    });

    for (const prediction of payload.predictions) {
      const predictionDate = new Date(
        `${prediction.predictionDate}T00:00:00.000Z`,
      );

      await tx.prediction.upsert({
        where: {
          clientId_predictionDate: {
            clientId: client.id,
            predictionDate,
          },
        },
        update: {
          predictedValue: prediction.predictedValue,
          realValue: prediction.realValue,
          source: "api-upload",
        },
        create: {
          clientId: client.id,
          predictionDate,
          predictedValue: prediction.predictedValue,
          realValue: prediction.realValue,
          source: "api-upload",
        },
      });
    }

    return tx.prediction.findMany({
      where: {
        clientId: client.id,
        predictionDate: {
          in: payload.predictions.map(
            (prediction) =>
              new Date(`${prediction.predictionDate}T00:00:00.000Z`),
          ),
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        predictionDate: "desc",
      },
    });
  });

  return Response.json(
    {
      predictions: serializePredictions(uploadedPredictions),
    },
    { status: 201 },
  );
}

export async function DELETE() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "You must sign in first." }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return Response.json(
      { error: "Only admins can delete predictions." },
      { status: 403 },
    );
  }

  await prisma.prediction.deleteMany();

  return new Response(null, { status: 204 });
}
