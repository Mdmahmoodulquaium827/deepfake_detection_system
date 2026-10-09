"use client";

import { useState } from "react";
import PredictionResult from "./PredictionResult";

export default function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // SELECT VIDEO
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    console.log("Selected file:", file.name);

    setSelectedFile(file);
    setResult(null);
    setError("");
  };

  // ============================================================
  // ANALYZE VIDEO
  // ============================================================

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please choose a video first.");
      return;
    }

    console.log("Sending video to backend:", selectedFile.name);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Backend response status:", response.status);

      const data = await response.json();

      console.log("Backend result:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Video analysis failed."
        );
      }

      setResult(data);

    } catch (err) {

      console.error("Prediction error:", err);

      setError(
        err.message ||
        "Could not connect to the Deepfake Detection API."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">

      {/* =====================================================
          UPLOAD CARD
      ====================================================== */}

      <div className="w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl">

        <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-950/50 p-10 text-center">

          {/* Upload Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0L8 8m4-4l4 4M5 16.5v1.25A2.25 2.25 0 007.25 20h9.5A2.25 2.25 0 0019 17.75V16.5"
              />
            </svg>

          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white">
            Upload your video
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Supported formats: MP4, AVI, MOV, MKV
          </p>

          {/* =================================================
              FILE INPUT
          ================================================== */}

          <div className="mx-auto mt-7 flex w-full max-w-md items-center overflow-hidden rounded-xl border border-slate-600 bg-slate-800">

            <label
              htmlFor="video-upload"
              className="cursor-pointer bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Choose File
            </label>

            <span className="min-w-0 flex-1 truncate px-4 text-left text-sm text-slate-300">
              {selectedFile
                ? selectedFile.name
                : "No file selected"}
            </span>

          </div>

          <input
            id="video-upload"
            type="file"
            accept=".mp4,.avi,.mov,.mkv,video/mp4,video/x-msvideo,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* =================================================
              ANALYZE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className={`mt-5 w-full max-w-md rounded-xl px-6 py-4 font-bold transition ${
              !selectedFile || loading
                ? "cursor-not-allowed bg-slate-700 text-slate-400"
                : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-violet-500"
            }`}
          >

            {loading
              ? "Analyzing Video..."
              : "Analyze Video"}

          </button>

          {/* Information */}
          <p className="mt-4 text-xs text-slate-500">
            The model analyzes 15 frames from the uploaded video.
          </p>

        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">

            <p className="font-medium text-red-400">
              {error}
            </p>

          </div>
        )}

      </div>

      {/* =====================================================
          PREDICTION RESULT
      ====================================================== */}

      {result && (
        <PredictionResult result={result} />
      )}

    </div>
  );
}