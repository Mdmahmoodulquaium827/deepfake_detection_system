"use client";

import { useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // VIDEO SELECTION
  // ============================================================

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];

    if (selectedVideo) {
      setVideo(selectedVideo);
      setResult(null);
      setError("");
    }
  };

  // ============================================================
  // ANALYZE VIDEO
  // ============================================================

  const analyzeVideo = async () => {
    if (!video) {
      alert("Please select a video first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // Create FormData
      const formData = new FormData();

      // This must match FastAPI:
      // file: UploadFile = File(...)
      formData.append("file", video);

      console.log("Sending video:", video.name);

      // ========================================================
      // SEND VIDEO TO FASTAPI
      // ========================================================

      const response = await fetch(
        "http://192.168.0.104:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      // ========================================================
      // GET BACKEND RESPONSE
      // ========================================================

      const data = await response.json();

      console.log("Backend response:", data);

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction failed."
        );
      }

      // ========================================================
      // SAVE RESULT
      // ========================================================

      setResult(data);

    } catch (err) {

      console.error("Prediction error:", err);

      setError(
        err.message ||
        "Unable to connect to the prediction server."
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          Deepfake Detector
        </h1>

        <p className="text-gray-500 mt-3">
          Upload a video to determine whether it is real or fake.
        </p>

      </div>


      {/* ======================================================
          UPLOAD CARD
          ====================================================== */}

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Video
        </label>


        {/* File Input */}

        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full border border-gray-300 rounded-lg p-3
                     cursor-pointer text-black
                     file:mr-4
                     file:py-2
                     file:px-4
                     file:rounded-lg
                     file:border-0
                     file:bg-slate-800
                     file:text-white"
        />


        {/* ==================================================
            SELECTED VIDEO
            ================================================== */}

        {video && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">

            <p className="text-sm text-gray-600">
              Selected:
            </p>

            <p className="font-medium text-gray-800 truncate">
              {video.name}
            </p>

          </div>
        )}


        {/* ==================================================
            ANALYZE BUTTON
            ================================================== */}

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
          {loading
            ? "Analyzing Video..."
            : "Analyze Video"}
        </button>

      </div>


      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (
        <div className="text-center mt-8">

          <div
            className="inline-block w-8 h-8
                       border-4 border-gray-300
                       border-t-black
                       rounded-full
                       animate-spin"
          >
          </div>

          <p className="mt-3 text-gray-600">
            Extracting frames and analyzing video...
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Please wait...
          </p>

        </div>
      )}


      {/* ======================================================
          ERROR
          ====================================================== */}

      {!loading && error && (
        <div className="max-w-xl mx-auto mt-8">

          <div
            className="bg-red-50 border border-red-200
                       text-red-700 rounded-2xl p-6 text-center"
          >

            <p className="font-semibold text-lg">
              Prediction Error
            </p>

            <p className="text-sm mt-2">
              {error}
            </p>

          </div>

        </div>
      )}


      {/* ======================================================
          DEEPFAKE RESULT
          ====================================================== */}

      {!loading && result && (
        <div className="max-w-xl mx-auto mt-8">

          <div
            className="bg-white rounded-2xl shadow-lg
                       border border-gray-200 p-8"
          >

            {/* ==================================================
                RESULT TITLE
                ================================================== */}

            <div className="text-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                DEEPFAKE RESULT
              </h2>

              <p className="text-sm text-gray-500 mt-2 truncate">
                {video?.name}
              </p>

            </div>


            {/* ==================================================
                PREDICTION
                ================================================== */}

            <div className="text-center mb-6">

              <div
                className={`inline-flex items-center
                            gap-2 px-6 py-3 rounded-full
                            text-xl font-bold
                            ${
                              result.prediction === "FAKE"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
              >

                <span className="text-2xl">
                  {result.prediction === "FAKE"
                    ? "⚠️"
                    : "✅"}
                </span>

                {result.prediction === "FAKE"
                  ? "FAKE VIDEO"
                  : "REAL VIDEO"}

              </div>

            </div>


            {/* ==================================================
                CONFIDENCE
                ================================================== */}

            <div className="text-center mb-8">

              <p className="text-gray-500 text-sm mb-1">
                Confidence
              </p>

              <p className="text-4xl font-bold text-gray-800">
                {Number(result.confidence).toFixed(2)}%
              </p>

            </div>


            {/* ==================================================
                REAL PROBABILITY
                ================================================== */}

            <div className="mb-5">

              <div className="flex justify-between mb-2">

                <span className="font-medium text-gray-700">
                  Real
                </span>

                <span className="font-semibold text-gray-700">
                  {Number(
                    result.real_probability
                  ).toFixed(2)}%
                </span>

              </div>


              <div
                className="w-full h-4 bg-gray-200
                           rounded-full overflow-hidden"
              >

                <div
                  className="h-full bg-green-500
                             rounded-full transition-all
                             duration-700"
                  style={{
                    width: `${result.real_probability}%`,
                  }}
                />

              </div>

            </div>


            {/* ==================================================
                FAKE PROBABILITY
                ================================================== */}

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <span className="font-medium text-gray-700">
                  Fake
                </span>

                <span className="font-semibold text-gray-700">
                  {Number(
                    result.fake_probability
                  ).toFixed(2)}%
                </span>

              </div>


              <div
                className="w-full h-4 bg-gray-200
                           rounded-full overflow-hidden"
              >

                <div
                  className="h-full bg-red-500
                             rounded-full transition-all
                             duration-700"
                  style={{
                    width: `${result.fake_probability}%`,
                  }}
                />

              </div>

            </div>


            {/* ==================================================
                FRAMES ANALYZED
                ================================================== */}

            <div
              className="border-t border-gray-200
                         pt-5 text-center"
            >

              <p className="text-sm text-gray-500">
                Frames analyzed
              </p>

              <p className="text-lg font-bold text-gray-800 mt-1">
                {result.frames_analyzed}
              </p>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}