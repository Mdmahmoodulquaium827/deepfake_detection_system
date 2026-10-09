
"use client";

import { useState } from "react";
import PredictionResult from "../components/PredictionResult";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];

    if (selectedVideo) {
      setVideo(selectedVideo);
      setResult(null);
    }
  };

  const analyzeVideo = () => {
    if (!video) {
      alert("Please select a video first.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Temporary dummy prediction
    setTimeout(() => {
      setResult({
        prediction: "FAKE",
        confidence: 91,
        real_probability: 9,
        fake_probability: 91,
      });

      setLoading(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Deepfake Detector
        </h1>

        <p className="text-gray-500 mt-3">
          Upload a video to determine whether it is real or fake.
        </p>
      </div>

      {/* Upload Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Video
        </label>

        <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white"
          />

        {/* Selected video */}
        {video && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Selected:
            </p>

            <p className="font-medium text-white truncate">
              {video.name}
            </p>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={analyzeVideo}
          disabled={loading}
          className="w-full mt-6 bg-black text-white py-3 rounded-lg
                     font-semibold
                     hover:bg-gray-800
                     disabled:bg-gray-400
                     disabled:cursor-not-allowed
                     transition"
        >
          {loading ? "Analyzing Video..." : "Analyze Video"}
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block w-8 h-8 border-4 border-gray-300
                          border-t-black rounded-full animate-spin">
          </div>

          <p className="mt-3 text-gray-600">
            Extracting frames and analyzing video...
          </p>
        </div>
      )}

      {/* Result */}
      {!loading && result && (
        <PredictionResult result={result} />
      )}

    </main>
  );
}
