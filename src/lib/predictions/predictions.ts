export type PredictionClient = {
  id: number;
  externalId: string;
  displayName: string | null;
  unit: string;
};

export type PredictionItem = {
  id: number;
  client: PredictionClient;
  predictionDate: string;
  predictedValue: number;
  realValue: number | null;
  difference: number | null;
  errorPercent: number | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PredictionsResponse = {
  predictions: PredictionItem[];
};

export type PredictionUploadItem = {
  predictionDate: string;
  predictedValue: number;
  realValue: number | null;
};

export type PredictionsUploadPayload = {
  clientExternalId: string;
  unit?: string;
  predictions: PredictionUploadItem[];
};

export async function fetchPredictions() {
  const response = await fetch("/api/predictions", {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorPayload?.error ?? "Failed to load predictions.");
  }

  return (await response.json()) as PredictionsResponse;
}

export async function uploadPredictions(payload: PredictionsUploadPayload) {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorPayload?.error ?? "Failed to upload predictions.");
  }

  return (await response.json()) as PredictionsResponse;
}

export async function deleteAllPredictions() {
  const response = await fetch("/api/predictions", {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorPayload?.error ?? "Failed to delete predictions.");
  }
}

export async function deletePrediction(id: number) {
  const response = await fetch(`/api/predictions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorPayload?.error ?? "Failed to delete prediction.");
  }
}
