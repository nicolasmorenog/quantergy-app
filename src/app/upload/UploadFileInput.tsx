"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./UploadFileInput.module.css";

type PredictionUploadRow = {
  id: number;
  date: string;
  value_predicted: number;
  value_real: number | null;
  error_percent: number | null;
};

type PredictionsUpload = {
  predictions: PredictionUploadRow[];
};

type UploadFileInputProps = {
  onUpload?: (predictions: PredictionUploadRow[]) => void;
};

export function UploadFileInput({ onUpload }: UploadFileInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = JSON.parse(content) as PredictionsUpload;

      onUpload?.(parsed.predictions);
    } catch {
      setError("Could not read the selected JSON file.");
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

        <Button type="button" disabled={!file} onClick={handleUpload}>
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
