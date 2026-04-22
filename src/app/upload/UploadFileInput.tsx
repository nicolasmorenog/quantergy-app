"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { PredictionsUploadPayload } from "@/lib/predictions/predictions";

import styles from "./UploadFileInput.module.css";

type UploadFileInputProps = {
  onUpload?: (payload: PredictionsUploadPayload) => Promise<void>;
};

export function UploadFileInput({ onUpload }: UploadFileInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
    setError("");
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      const content = await file.text();
      const parsed = JSON.parse(content) as PredictionsUploadPayload;

      if (
        typeof parsed.clientExternalId !== "string" ||
        parsed.clientExternalId.trim() === "" ||
        (parsed.unit !== undefined &&
          (typeof parsed.unit !== "string" || parsed.unit.trim() === "")) ||
        !Array.isArray(parsed.predictions) ||
        parsed.predictions.length === 0 ||
        parsed.predictions.some(
          (prediction) =>
            typeof prediction.predictionDate !== "string" ||
            typeof prediction.predictedValue !== "number" ||
            !(
              typeof prediction.realValue === "number" ||
              prediction.realValue === null
            ),
        )
      ) {
        throw new Error("Invalid predictions payload.");
      }

      if (onUpload) {
        await onUpload(parsed);
      }

      setError("");
      setFile(null);
      setFileName("");
      toast.success("Predictions JSON was uploaded");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not upload the selected JSON file.";

      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload predictions JSON</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <Input
          id="json-upload"
          type="file"
          accept=".json,application/json"
          onChange={handleChange}
          className={styles.fileInput}
        />

        <div className={styles.fileControl}>
          <Button asChild variant="outline" className={styles.fileButton}>
            <label htmlFor="json-upload">
              {fileName || "Choose JSON file"}
            </label>
          </Button>
        </div>

        <Button
          type="button"
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          Upload file
        </Button>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
