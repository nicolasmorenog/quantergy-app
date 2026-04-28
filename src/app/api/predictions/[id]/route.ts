import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getCurrentUser } from "@/server/auth/session";

type DeletePredictionRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _: Request,
  { params }: DeletePredictionRouteContext,
) {
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

  const { id } = await params;
  const predictionId = Number(id);

  if (!Number.isInteger(predictionId) || predictionId <= 0) {
    return Response.json({ error: "Invalid prediction id." }, { status: 400 });
  }

  try {
    await prisma.prediction.delete({
      where: {
        id: predictionId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Prediction not found." }, { status: 404 });
    }

    throw error;
  }

  return new Response(null, { status: 204 });
}
